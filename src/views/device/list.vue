<template>
	<div class="app-container">
		<el-container>
			<el-form :inline="true">
				<div class="filter">

					<div class="filterTop2">
						<span class="left">查询条件</span>
						<span class="right">
          			<el-button type="primary"  @click="getList()">查询</el-button>
          			<el-button @click="clearAll">重置</el-button>
        			</span>
					</div>

					<div class="row">
						<label>主机名</label>
						<el-autocomplete class="inline-input" v-model="hostname" :fetch-suggestions="nameSearch" placeholder="请输入内容" :trigger-on-focus="false"></el-autocomplete>
						<label>节点类型</label>
						<el-select v-model="hosttype" clearable placeholder="请选择">
							<el-option v-for="item in hosttypes" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</div>
					<div class="row">
						<label>分组</label>
						<el-autocomplete class="inline-input" v-model="group" :fetch-suggestions="groupSearch" placeholder="请输入内容" :trigger-on-focus="false"></el-autocomplete>
						<label>IP</label>
						<el-autocomplete class="inline-input" v-model="hostip" :fetch-suggestions="ipSearch" placeholder="请输入内容" :trigger-on-focus="false"></el-autocomplete>
					</div>
				</div>
			</el-form>
			<el-main>
				<div class="hasten">
					<el-button type="primary" size="mini" @click="saveEntity">
						<i class="el-icon-plus"></i> 添加主机
					</el-button>
					<el-button type="primary" size="mini" @click="getList">
						<i class="el-icon-refresh-right"></i> 刷新
					</el-button>
					<router-link :to="{ name: 'device.add' }">
						<el-button type="primary" size="mini">
							<i class="el-icon-plus"></i> 批量添加设备
						</el-button>
					</router-link>
				</div>
				<el-table v-loading="loading" :data="devices" element-loading-text="Loading" fit highlight-current-row style="width: 100%">
					<el-table-column label="主机名" width="120">
						<template v-slot="{row}">
							<template v-if="row.edit">
								<el-input v-model="row.name" class="edit-input" size="small" />
							</template>
							<span v-else>{{ row.name }}</span>
						</template>
					</el-table-column>

					<el-table-column label="组别" width="110">
						<template v-slot="{row}">
							<template v-if="row.edit">
								<el-input v-model="row.group" class="edit-input" size="small" />
							</template>
							<span v-else>{{ row.group }}</span>
						</template>
					</el-table-column>
					<el-table-column label="状态">
						<template v-slot="{row}">
							<el-tag size="mini" :type="statusMap[row.type].type">{{row.type | type}}</el-tag>
						</template>
					</el-table-column>
					<!--<el-table-column label="电源">
						<template v-slot="{row}">
							<el-tag size="mini" :type="powerSupplyMap[row.powerSupply].type">{{row.powerSupply | powerSupply}}</el-tag>
						</template>
					</el-table-column>-->
					<el-table-column label="IP" width="140">
						<template v-slot="{row}">
							<template v-if="row.edit">
								<el-input v-model="row.hostIp" class="edit-input" size="small" />
							</template>
							<span v-else>{{ row.hostIp }}</span>
						</template>
					</el-table-column>
					<!--<el-table-column label="硬件配置" align="center" width="220">
						<template v-slot="{row}">
							<span>{{ row.hardware }}</span>
						</template>
					</el-table-column>-->
					<el-table-column fixed="right" label="操作" width="200">
						<template v-slot="{row}">
							<el-button-group>
								<!-- 编辑模式：确定 -->
								<el-button v-if="row.edit" type="warning" size="mini" icon="el-icon-circle-check-outline" @click="confirmEdit(row)">确定</el-button>
								<!-- 编辑模式：取消 -->
								<el-button v-if="row.edit" type="success" size="mini" icon="el-icon-circle-check-outline" @click="cancelEdit(row)">取消</el-button>

								<!-- 查看详情 -->
								<el-tooltip class="item" effect="dark" content="查看" placement="top-end">
									<el-button v-if="!row.edit" type="success" icon="el-icon-view" size="mini" @click="info(row)"></el-button>
								</el-tooltip>
								<el-tooltip class="item" effect="dark" content="编辑" placement="top-end">
									<el-button v-if="!row.edit" type="warning" size="mini" icon="el-icon-edit" @click="row.edit=!row.edit"></el-button>
								</el-tooltip>
								<el-tooltip class="item" effect="dark" content="删除" placement="top-end">
									<el-button v-if="!row.edit" type="danger" size="mini" icon="el-icon-delete" @click="deleteItem(row)"></el-button>
								</el-tooltip>
							</el-button-group>
						</template>
					</el-table-column>
				</el-table>
				<el-dialog :title="titleHead" :visible.sync="dialogCreating" width="50%">
					<el-form :model="create" :rules="rules" ref="create" label-width="100px" class="demo-ruleForm">
						<el-form-item label="节点主机名" prop="name">
							<el-input class="formInp" v-model="create.name"></el-input>
						</el-form-item>
						<el-form-item label="节点类型" prop="type">
							<el-select class="formInp" v-model="create.type" clearable placeholder="请选择">
								<el-option v-for="item in create.types" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="节点IP" prop="hostIp">
							<el-input class="formInp" v-model="create.hostIp"></el-input>
						</el-form-item>
						<el-form-item label="节点所属组" prop="group">
							<el-input class="formInp" v-model="create.group"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="submitForm('create')">立即创建</el-button>
							<el-button @click="resetForm('create')">重置</el-button>
						</el-form-item>
					</el-form>
				</el-dialog>
			</el-main>
			<el-footer class="pagination">
				<pagination v-show="page.total>0" :total="page.total" :page.sync="page.currentPage" :limit.sync="page.pageSize" @pagination="getList" />
			</el-footer>
		</el-container>
	</div>
</template>

<script>
	import {
		GetList,
		SaveNodeEntity,
		UpdateEntityOne,
		DeleteEntityOne
	} from "@/api/device";

	import Pagination from "@/components/Pagination";
	import Tags from "@/components/Tags";
	import Dropdown from "@/components/Dropdown";

	const statusMap = {
		head: {
			name: "空闲",
			type: "success"
		},
		compute: {
			name: "繁忙",
			type: "danger"
		},
		2: {
			name: "繁忙",
			type: "danger"
		},
		222: {
			name: "繁忙",
			type: "danger"
		},
		test: {
			name: "占用",
			type: "warning"
		}
	};
	const powerSupplyMap = {
		OFF: {
			name: "关机",
			type: "danger"
		},
		ON: {
			name: "开机",
			type: "success"
		}
	};
	export default {
		components: {
			Pagination,
			Tags,
			Dropdown
		},
		filters: {
			type(type) {
				return statusMap[type].name;
			},
			powerSupply(powerSupply) {
				return powerSupplyMap[powerSupply].name;
			}
		},
		data() {
			return {
				statusMap: statusMap,
				powerSupplyMap: powerSupplyMap,
				//查询条件
				hostname: '',
				hosttypes: [{
					value: 'head',
					label: 'head'
				}, {
					value: 'compute',
					label: 'compute'
				}],
				hosttype: '',
				group: '',
				hostip: '',
				nameRestaurants: [],
				groupRestaurants: [],
				ipRestaurants: [],
				// 分页数据
				page: {
					currentPage: 1,
					pageCount: 1,
					pageSize: 5,
					total: 1
				},
				// 下拉选择数据
				dropdown: {
					selected: {
						key: "name",
						value: "主机名"
					},
					items: {
						name: "主机名",
						nickName: "组别"
					}
				},
				// 查询条件
				query: {
					type: "",
					productKey: "",
					input: ""
				},
				products: [],
				devices: [],
				loading: false,
				dialogCreating: false,
				titleHead: '',
				// 节点添加信息
				create: {
					name: '',
					type: "",
					types: [{
						value: 'head',
						label: 'head'
					}, {
						value: 'compute',
						label: 'compute'
					}],
					hostIp: "",
					group: ""
				},
				rules: {
					name: [{
						required: true,
						message: '请输入节点名',
						trigger: 'blur'
					}],
					type: [{
						required: true,
						message: '请选择节点类型',
						trigger: 'change'
					}],
					hostIp: [{
						required: true,
						message: '请输入节点IP',
						trigger: 'blur'
					}],
					group: [{
						required: true,
						message: '请输入节点所属组',
						trigger: 'blur'
					}]
				}
			};
		},
		created() {
			//this.fetchProductList();
			//this.fetchData();
			this.getList()
		},
		methods: {
			getList() {
				let _this = this;
				let params = {
					pageOption: {
						pageNumber: _this.page.currentPage, //当前页数
						pageSize: _this.page.pageSize //每一页显示条数
					},
					selectOption: {}
				};
				if(_this.hostname !== '') {
					params.selectOption.name = _this.hostname
				};
				if(_this.hosttype !== '') {
					params.selectOption.type = _this.hosttype
				};
				if(_this.hostip !== '') {
					params.selectOption.hostIp = _this.hostip
				};
				if(_this.group !== '') {
					params.selectOption.group = _this.group
				};
				GetList(params).then(res => {
					//_this.devices = []
					_this.devices = res.result.nodeData.map(function(item, index) {
						/*let obj = {
							edit: false
						};
						Object.assign(obj, item);
						_this.devices.push(obj);*/
						// 保存一份原始数据，便于取消编辑的时候还原数据
						const original = _.cloneDeep(item);
						item.original = original;
						_this.$set(item, "edit", false);
						return item;
					});
					_this.page.total = res.pageResultData.totalDataNumber;
					_this.page.pageCount = res.pageResultData.totalCount;
				}).catch(res => {
					console.log(res)
				})
			},

			//重置按钮
			clearAll() {
				//节点主机名
				this.hostname = '';
				//节点类型
				this.hosttype = '';
				//所属组别
				this.group = '';
				//节点ip
				this.hostip = ''

			},

			nameSearch(queryString, cb) {
				var restaurants = this.nameRestaurants;
				var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
				// 调用 callback 返回建议列表的数据
				cb(results);
			},
			groupSearch(queryString, cb) {
				var restaurants = this.groupRestaurants;
				var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
				// 调用 callback 返回建议列表的数据
				cb(results);
			},
			ipSearch(queryString, cb) {
				var restaurants = this.ipRestaurants;
				var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
				// 调用 callback 返回建议列表的数据
				cb(results);
			},
			createFilter(queryString) {
				return(restaurant) => {
					return(restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
				};
			},

			saveEntity() {
				this.dialogCreating = true;
				this.titleHead = '添加节点'
			},
			//添加节点
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						let _this = this;
						let params = {
							name: _this.create.name,
							type: _this.create.type,
							hostIp: _this.create.hostIp,
							group: _this.create.group
						};
						SaveNodeEntity(params).then(res => {
							_this.getList();
							_this.dialogCreating = false;
							_this.$message({
								type: 'success',
								message: '添加成功!'
							});
						}).catch((res) => {
							_this.$message({
								type: 'error',
								message: '添加失败'
							});
						});;
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},

			// 查看设备详情
			info(device) {
				this.$router.push({
					name: "device.info",
					params: {
						device: device
					}
				});
			},

			// 获取数据
			async fetchData() {
				let params = {
					pageSize: this.page.pageSize,
					pageNo: this.page.currentPage
				};
				// this.loading = true;
				findDevices(params).then(response => {
					this.loading = false;
					const items = response.datas;
					this.devices = items.map(v => {
						// 处理状态显示
						v.flag = v.status !== "DISABLE";

						// 处理 tags 将字符串 拆分成 数组
						if(v.tags && v.tags.length > 0) {
							v.tags = v.tags.split("|");
						} else {
							v.tags = [];
						}
						// 保存一份原始数据，便于取消编辑的时候还原数据
						const original = _.cloneDeep(v);
						v.original = original;
						this.$set(v, "edit", false);
						return v;
					});
					this.page.total = response.pageInfo.totalCount;
				});
			},

			// 删除
			async deleteItem(row) {
				let _this = this;
				_this.$confirm('此操作将删除该节点, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let params = {
						_id: row._id
					};
					DeleteEntityOne(params).then(res => {
						_this.getList();
						_this.$message({
							type: 'success',
							message: '删除成功!'
						});
					}).catch((res) => {
						_this.$message({
							type: 'error',
							message: '删除失败'
						});
					});;
				}).catch(() => {
					_this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},

			// 取消编辑
			cancelEdit(row) {
				row.edit = false;
				// 还原数据
				row.name = row.original.name;
				row.hostIp = row.original.hostIp;
				row.group = row.original.group;
			},

			// 确认编辑
			async confirmEdit(row) {
				let params = {
					oldOption: {
						_id: row._id
					},
					newOption: {}
				};
				if(row.name !== '') {
					params.newOption.name = row.name
				};
				if(row.type !== '') {
					params.newOption.type = row.type
				};
				if(row.hostIp !== '') {
					params.newOption.hostIp = row.hostIp
				};
				if(row.group !== '') {
					params.newOption.group = row.group
				};

				await UpdateEntityOne(params);
				row.original.name = row.name;
				row.original.hostIp = row.hostIp;
				row.original.group = row.group;
				row.edit = false;
			}
		}
	};
</script>

<style scoped>
	.filter {
		width: 98%;
		border: 1px solid #E8E8E8;
		margin-top: 20px;
		margin-left: 1%;
		height: 170px;
	}
	
	.filterTop2 {
		width: 100%;
		height: 40px;
		background-color: #FAFAFA;
		border-bottom: 1px solid #E8E8E8;
		line-height: 40px;
	}
	
	.filterTop2 .left {
		display: inline-block;
		width: 49%;
		text-align: left;
		margin-left: 1%;
		color: #747474;
		font-size: 14px;
	}
	
	.filterTop2 .right {
		display: inline-block;
		width: 45%;
		text-align: right;
	}
	
	.filterTop2 .right .el-button {
		width: 82px;
		height: 28px;
		padding: 0 0;
	}
	
	.filter .row {
		margin-top: 20px;
	}
	
	.filter .row label {
		display: inline-block;
		width: 15%;
		text-align: right;
		margin-right: 2%;
		font-weight: 400;
	}
	
	.filter .row .el-input {
		width: 30%;
		height: 28px;
	}
	
	.filter .row .el-input__icon {
		line-height: 1 !important;
	}
	
	.filter .row .el-select {
		width: 30%;
		height: 28px;
	}
	
	.filter .row .el-autocomplete {
		width: 30%;
		height: 28px;
	}
	
	.filter .row .el-input__inner {
		height: 100%;
	}
	
	.filter .row .el-select .el-input--suffix {
		width: 100% !important;
	}
	
	.hasten {
		width: 100%;
		background-color: #FAFAFA;
		height: 40px;
		border: 1px solid #E8E8E8;
		margin-top: 20px;
		margin-bottom: 10px;
		line-height: 40px;
		padding: 5px 10px;
	}
	/*.hasten .el-form-item__content {
		width: 300px;
	}*/
	
	.hasten .el-button {
		margin-left: 2%;
		height: 28px;
		line-height: 0;
		float: right;
	}
	
	.pagination {
		text-align: right;
	}
	
	.table-expand {
		font-size: 0;
	}
	
	.table-expand label {
		width: 90px;
		color: #99a9bf;
	}
	
	.table-expand .el-form-item {
		margin-right: 0;
		margin-bottom: 0;
		width: 50%;
	}
	
	.app-container .el-dialog .el-row .size {
		line-height: 40px;
		padding-left: 12px;
	}
	
	.app-container .el-dialog__wrapper:nth-child(4) .el-dialog {
		background: red;
	}
	
	.app-container .el-dialog__wrapper:nth-child(4) .el-dialog .el-dialog__header {
		text-align: center;
	}
	
	.app-container .el-dialog .formInp {
		width: 95%;
	}
</style>