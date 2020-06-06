<template>
	<view class="container">	 
	    <view class="in-mask"></view>
	    <view class='p-3'>
			<view class="d-flex py-2" style="border-bottom: 1rpx solid #D8D8D8;">
				<view style="width: 150rpx; text-align: right;">省份简称</view>
				<view @click="showWrap('city')" style="width: 60%; margin-left: 30rpx;">{{city}}</view>
			</view>
			<view class="d-flex py-2" style="border-bottom: 1rpx solid #D8D8D8;">
				<view style="width: 150rpx; text-align: right;">首字母选择</view>
				<view @click="showWrap('letter')" style="width: 60%; margin-left: 30rpx;">{{letter}}</view>
			</view>
			<view class="d-flex py-2" style="border-bottom: 1rpx solid #D8D8D8;">
				<text style="width: 150rpx; text-align: right;">车牌后几位</text>
				<input type="text" class="ml-3" v-model="nums" :focus="focus" @click="clickMask" placeholder="英文字母大写"/>
			</view>
			<view class="text-center mt-4" @tap="selectTrue">
				<text class="d-inline-block font-md main-bg-color text-fff" style="padding: 15rpx 240rpx;border-radius: 20rpx;">选 中 返 回</text>
			</view>
	      <!-- <slot></slot> -->
	    </view>
	    <transition name="hehe">
	      <div v-if="show">
	        <!--车牌首字-->
	        <div class="first-word-wrap"
	             v-if="showFirst">
	          <div class="first-word">
	            <div class="word"
	                 v-for="item in allKeyWord.province"
	                 @click="selectFirstWord(item)"
	                 :key="item.id">
	              <span>{{item}}</span>
	            </div>
	            <div class="in-delete"
	                 @click="deleteItem('city')">
	              <i class="cubeic-wrong"
	                 style="font-size:23px;"></i>
	              <span>x</span>
	            </div>
	          </div>
	          <div class="in-close"
	               @click="close">
	            收起
	          </div>
	        </div>
	 
	        <!--车牌余字-->
	        <div class="keyboard-wrap"
	             v-else>
	          <div class="keyboard">
	            <div class="in-alphabet">
	              <span v-for="(item,index) in allKeyWord.alphabet"
	                    :key="index"
	                    @click="clickKeyBoard(item)">{{item}}</span>
	              <div class="in-delete"
	                   @click="deleteItem('letter')">
	                <i class="cubeic-wrong"
	                   style="font-size:23px;"></i>
	              </div>
	            </div>
	          </div>
	          <div class="in-close"
	               @click="close">
	            收起
	          </div>
	 
	        </div>
	      </div>
	    </transition>
	  </view>
</template>

<script>
	export default {
	  data () {
	    return {
		  id: '',
	      selectArr: [],
		  tel: '',
		  city: '',
		  letter: '',
		  nums: '',
		  focus: false,
	      allKeyWord: {
	        province: ['京', '湘', '津', '鄂', '沪', '粤', '渝', '琼', '翼', '川', '晋', '贵', '辽', '云', '吉', '陕', '黑', '甘', '苏', '青', '浙', '皖', '藏', '闽', '蒙', '赣', '桂', '鲁', '宁', '豫', '新'],
	        alphabet: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
	      },
	      show: true,
	      showFirst: true
	    }
	  },
	  watch: {
	    selectArr (val) {
	      this.$emit('input', val)
	    }
	  },
	  methods: {
	    showWrap (text) {
	      this.show = true
	      // this.showFirst = !(this.selectArr.length > 0)
		  if(text == 'city'){
			  this.showFirst = true
		  }else{
			  this.showFirst = false
		  }
	    },
	    selectFirstWord (item) {
	      this.addSelect(item)
	      this.showFirst = false;
		  this.city = item;
	    },
	    clickKeyBoard (item) {
	      this.addSelect(item);
		  this.letter = item;
		  this.close()
		  this.focus = true;
	    },
	    addSelect (item) {
	      // 点击自定义键盘
	      if (this.selectArr.length < 7) {
	        this.selectArr.push(item)
	      } else {
	        // this.$createToast({
	        //   txt: '车牌号选择超过规定个数',
	        //   type: 'txt'
	        // }).show()
	        // this.close()
	      }
	    },
		setNums(){
			// this.show
		},
	    deleteItem (text) {
	      this.selectArr.pop()
	      this.showFirst = !(this.selectArr.length > 0)
		  if(text == 'city'){
			  this.city = ''
		  }else{
			  this.letter = ''
		  }
	    },
	    close () {
	      this.show = false
	    },
		selectTrue(){
			if(!this._isVehicleNumber(this.nums)){
				return uni.showToast({
					title: '车牌号输入有误',
					icon: 'none'
				})
			}
			if(!this.selectArr[0]){
				this.show = true;
				this.showFirst = true
				return uni.showToast({
					title: '请选择省份',
					icon: 'none'
				})
			}
			if(!this.selectArr[1]){
				this.show = true;
				this.showFirst = false
				return uni.showToast({
					title: '请选择市字母',
					icon: 'none'
				})
			}
			const car_value = this.selectArr[0] + this.selectArr[1] + this.nums;
			uni.navigateTo({
				url: 'market?car_value='+car_value+'&tel='+this.tel+'&id='+this.id
			})
		},
	    clickMask () {
	      // console.log('clickMask')
	      this.close()
		  this.focus = true;
	    },
		_isVehicleNumber(vehicleNumber) {
		    const reg = /([A-Z0-9]){5,6}/g
			let A = false;
			if(reg.test(vehicleNumber) && vehicleNumber.length <= 6){
				A = true;
			}
			return A;
		},
	  },
	  mounted () {
	    this.selectArr = [];
	  },
	  onLoad(option){
		  this.id = option.id;
		  this.tel = option.tel;
	  }
	}
</script>

<style lang="less" scoped>
	.container {
	  .in-mask {
	    position: absolute;
	    left: 0;
	    top: 0;
	    z-index: -1;
	 
	    width: 100%;
	    height: 100vh;
	    background: rgba(0, 0, 0, 0);
	  }
	  .first-word-wrap {
	    // height: 9.4rem;
	    background-color: #d2d5db;
	    padding: 10px;
	    position: fixed;
	    bottom: 0;
	    left: 0;
	    right: 0;
	    .first-word {
	      display: flex;
	      flex-wrap: wrap;
	      justify-content: space-around;
	      &::after {
	        //重要
	        width: 41px;
	        content: "";
	      }
	      .word {
	        box-sizing: border-box;
	        width: 30px;
	        height: 30px;
	        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.35);
	        text-align: center;
	        margin: 5px;
	        span {
	          box-sizing: border-box;
	          display: flex;
	          align-items: center;
	          justify-content: center;
	          text-align: center;
	          width: 100%;
	          height: 100%;
	          background-color: #fff;
	          color: #000;
	          // border: 1px solid #fff;
	          border-radius: 0.125rem;
	        }
	      }
	    }
	  }
	  .keyboard-wrap {
	    background-color: #d2d5db;
	    position: fixed;
	    bottom: 0;
	    left: 0;
	    right: 0;
	    padding: 10px;
	    .keyboard {
	      display: flex;
	      justify-content: space-between;
	      align-items: center;
	      .in-alphabet {
	        display: flex;
	        flex-wrap: wrap;
	        justify-content: space-around;
	        &::after {
	          //重要
	          width: 174px;
	          content: "";
	        }
	        span {
	          text-align: center;
	          display: flex;
	          align-items: center;
	          justify-content: center;
	          width: 30px;
	          height: 30px;
	          box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.35);
	          background-color: #fff;
	          border-radius: 5px;
	          margin: 5px;
	          &:active {
	            background-color: #e4e4e4;
	          }
	          &.bordernone {
	            border: none;
	            box-shadow: none;
	            background-color: #d2d5db;
	            &:active {
	              background-color: #d2d5db;
	            }
	          }
	          &.delete {
	            background-color: #465266;
	          }
	          // &:last-child {
	          //   flex: 1;
	          // }
	        }
	      }
	    }
	  }
	 
	  .in-close {
	    text-align: center;
	    display: flex;
	    align-items: center;
	    justify-content: center;
	    width: 100%;
	    height: 30px;
	    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.35);
	    background-color: #fff;
	    border-radius: 5px;
	    margin: 5px;
	    &:active {
	      background-color: #e4e4e4;
	    }
	    &.bordernone {
	      border: none;
	      box-shadow: none;
	      background-color: #d2d5db;
	      &:active {
	        background-color: #d2d5db;
	      }
	    }
	    &.delete {
	      background-color: #465266;
	    }
	    &:last-child {
	      flex: 1;
	    }
	  }
	 
	  .in-delete {
	    text-align: center;
	    display: flex;
	    align-items: center;
	    justify-content: center;
	    width: 30px;
	    height: 30px;
	    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.35);
	    background-color: #fff;
	    border-radius: 5px;
	    margin: 5px;
	 
	    &:active {
	      background-color: #e4e4e4;
	    }
	    &.bordernone {
	      border: none;
	      box-shadow: none;
	      background-color: #d2d5db;
	      &:active {
	        background-color: #d2d5db;
	      }
	    }
	    &.delete {
	      background-color: #465266;
	    }
	  }
	}
	 
	/*淡入淡出*/
	.hehe-enter,
	.hehe-leave-to {
	  opacity: 0;
	}
	.hehe-enter-to,
	.hehe-leave {
	  opacity: 1;
	}
	.hehe-enter-active,
	.hehe-leave-active {
	  transition: all 0.5s;
	}
</style>
