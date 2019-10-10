<template>
	<el-row :gutter="10" class="panel-group">
		<el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
			<div class="card-panel" @click="handleSetLineChartData('newVisitis')">
				<iframe :src="CPUSrc" width="100%" height="100%" frameborder="0" ></iframe>
			</div>
		</el-col>
		<el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
			<div class="card-panel" @click="handleSetLineChartData('messages')">
				<iframe :src="RAMSrc" width="100%" height="100%" frameborder="0"></iframe>
			</div>
		</el-col>
		<el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
			<div class="card-panel" @click="handleSetLineChartData('purchases')">
				<iframe :src="storageSrc" width="100%" height="100%" frameborder="0"></iframe>
			</div>
		</el-col>
		<el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
			<div class="card-panel" @click="handleSetLineChartData('shoppings')">
				<iframe :src="netSrc" width="100%" height="100%" frameborder="0"></iframe>
			</div>
		</el-col>
	</el-row>
</template>

<script>
	export default {
		data() {
			return {
				CPUSrc: '',
				RAMSrc: '',
				storageSrc: '',
				netSrc: ''
			}
		},
		created() {
			this.iframeTime();
		},
		methods: {
			handleSetLineChartData(type) {
				this.$emit('handleSetLineChartData', type)
			},
			iframeTime() {
				let _this = this;
				let httpUrl = "http://16.16.18.61:3000/d-solo/fafSLghZz/dashboard?orgId=1";
				let timeInterval = "&from=now-30m&to=now";
				let CPUId = "&panelId=2";
				let RAMId = "&panelId=6";
				let storageId = "&panelId=4";
				let netId = "&panelId=8";
				_this.CPUSrc = httpUrl+timeInterval+CPUId;
				_this.RAMSrc = httpUrl+timeInterval+RAMId;
				_this.storageSrc = httpUrl+timeInterval+storageId;
				_this.netSrc = httpUrl+timeInterval+netId;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.panel-group {
		.card-panel-col {
			margin-bottom: 16px;
		}
		.card-panel {
			height: 300px;
			cursor: pointer;
			font-size: 16px;
			position: relative;
			overflow: hidden;
			color: #666;
			background: #fff;
			box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
			border-color: rgba(0, 0, 0, .05);
			&:hover {
				.card-panel-icon-wrapper {
					color: #fff;
				}
			}
			.icon-people {
				color: #40c9c6;
			}
			.icon-message {
				color: #36a3f7;
			}
			.icon-money {
				color: #f4516c;
			}
			.icon-shopping {
				color: #34bfa3
			}
			.card-panel-icon-wrapper {
				float: left;
				margin: 14px 0 0 14px;
				padding: 16px;
				transition: all 0.38s ease-out;
				border-radius: 6px;
			}
			.card-panel-icon {
				float: left;
				font-size: 48px;
			}
			.card-panel-description {
				float: right;
				font-weight: bold;
				margin: 26px;
				margin-left: 0px;
				.card-panel-text {
					line-height: 18px;
					color: rgba(0, 0, 0, 0.45);
					font-size: 16px;
					margin-bottom: 12px;
				}
				.card-panel-num {
					font-size: 20px;
				}
			}
		}
	}
</style>