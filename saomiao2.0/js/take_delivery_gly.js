var global_commen_supplier_number;

function search_pinzhong(product_id) {
	//庆喜加
	host = localStorage.getItem('host');
	
	apiready = function() {
		api.parseTapmode();
	}
	var toast = new auiToast({});
	console.log('-------------------');
	console.log(global_commen_supplier_number);
	console.log(product_id);
	console.log('-------------------');
	var user_num = localStorage.getItem('number');
	var user_name = localStorage.getItem('name');	
	mui.ajax(host + '/selectProduct', {
		data: {
			value: product_id,
			client_iD: global_commen_supplier_number,
			user_num:user_num,
			user_name:user_name
		},
		dataType: 'json', //服务器返回json格式数据
		type: 'get', //HTTP请求类型
		timeout: 10000, //超时时间设置为10秒；
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		success: function(data) {
			//服务器返回响应，根据响应结果，分析是否登录成功；
			console.log('进入搜索品种----------------');
			console.log(JSON.stringify(data));
			if(data.length == 0) {
				toast.fail({
					title: "未找到数据",
					duration: 2000
				});
			} else {
				arr = data[0];
				for(var x in arr) {
					key = x; //键
					value = arr[x]; //值
					$('#' + key).val(arr[key]);
				}
				$('#product_received').val(arr['product_not']); //收货数量默认=未收数量

			}

		},
		error: function(xhr, type, errorThrown) {
			//异常处理；
			console.log(type);
		}
	});
}

function submitdata() {
	apiready = function() {
		api.parseTapmode();
	}
	var toast = new auiToast({});

	// var inputs_obj = document.getElementsByTagName("input"); //空判断
	// for(i = 0; i < inputs_obj.length; i++) {
	// 	if(inputs_obj[i].type !== "hidden" && inputs_obj[i].value == "") {

	// 		inputs_obj[i].focus();
	// 		toast.fail({
	// 			title: "你必须输入" + inputs_obj[i].parentNode.previousElementSibling.childNodes[1].textContent.replace(':', '').replace('：', '') || '完整信息',
	// 			duration: 2000
	// 		});
	// 		return;
	// 	}
	// }

	var val_Quality = $('input:radio[name="Quality"]:checked').val();
	if(val_Quality == '1' && $('#reason_for_rejection').val().trim() == '') {
		toast.fail({
			title: "请输入拒收原因",
			duration: 2000
		});
	}

	var val_Type = $('input:radio[name="Type"]:checked').val();
	if(val_Type == '1' && $('#reason_for_rejection').val().trim() == '') {
		toast.fail({
			title: "请输入拒收原因",
			duration: 2000
		});
	}
	host = localStorage.getItem('host');
	var url = host + '/check_gd';
	// var url = 'http://cwc.vaiwan.com/check_gd';
	var formId = 'myForm'
	$.ajax({
		type: 'GET',
		url: url,
		data: $('#' + formId).serialize(),
		async: true, // true（异步）, false（同步）
		cache: false,
		contentType: false,
		processData: false,
		success: function(result) {
			
			console.log("===="+JSON.stringify(result.msg))
			var msg = JSON.stringify(result.msg);
			console.log("ajax请求成功" + msg);
			
			if(result.code=='0'){
				toast.fail({
				title: msg,
				duration: 2000
			});
				
				
			}else{
				toast.success({
				title: msg,
				duration: 2000
			});
			}
			var c = $('#search-input2');
			c.focus();
			$(":input").val("");
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			console.log("ajax请求失败" + textStatus);

			toast.fail({
				title: "提交失败",
				duration: 2000
			});
		}
	})
	$(":input").val("");
}

function setBack() {
	pushHistory();
	window.addEventListener("popstate", function(e) {
		window.location.href = 'index_gly.html'; //指定回退的地址
	}, false);

	function pushHistory() {
		var state = {
			title: "title",
			url: "#" // 本页
		};
		window.history.pushState(state, "title", "#");
	}
}

function show_storage() {
	host = localStorage.getItem('host');
	var user_num = localStorage.getItem('number');
	var user_name = localStorage.getItem('name');		
	mui.ajax(host + '/getStorage', {
		data: {
			user_num: user_num,
			user_name: user_name
		},
		dataType: 'json', //服务器返回json格式数据
		type: 'get', //HTTP请求类型
		timeout: 10000, //超时时间设置为10秒；
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		success: function(data) {
			//服务器返回响应，根据响应结果，分析是否登录成功；
			addSeletion(data);
		},
		error: function(xhr, type, errorThrown) {
			//异常处理；
			console.log(type);
		}
	});
}

function addSeletion(my_data) {
	// jsadditemtoselect($('#num_sel'),"添加","a")
	for(j = 0, len = my_data.length; j < len; j++) {
		value = my_data[j]['sto_name'];
		var obj = $('#product_storage')
		if(!isExistOption('product_storage', value)) {
			obj.append(new Option(value, my_data[j]['sto_id']));
		}
	}

}

function isExistOption(id, value) {
	//判断值为value的option是否存在
	var isExist = false;
	var count = $('#' + id).find('option').length;

	for(var i = 0; i < count; i++) {
		if($('#' + id).get(0).options[i].value == value) {
			isExist = true;
			break;
		}
	}
	//				console.log(isExist)
	return isExist;
}


$(function() { //此句代表整个html加载完了才执行，这里body都没东西，自然不需要

	//扫码跳转
	// $('input[id=xzpz]').keydown(function(d) {
	// 	console.log(d.keyCode);
	// 	if(d.keyCode != 13) return;
	// 	search_pinzhong($('#xzpz').val());
	// 	var a = $('#product_received');
	// 	a.focus();
	// });
	$('input[id=search-input2]').keydown(function(d) {
		console.log(d.keyCode);
		if (d.keyCode != 13) return;
		search_pinzhong($('#search-input2').val());
		var a = $('#product_received');
		a.focus();
	});	
	setBack()
	temp_commen_supplier_number = localStorage.getItem("commen_supplier_number");
	localStorage.removeItem('commen_supplier_number');
	if(temp_commen_supplier_number == null) {
		console.log("none") //不存在
		//					document.getElementById('shxx').
		//					$('#shxx').style.onClick = true;
		$('.aui-tab ul li').click(function() {

		})
	} else { //回到选择供方
		global_commen_supplier_number = temp_commen_supplier_number;
		localStorage.removeItem('commen_supplier_number');
		$('#supplier_number').val(temp_commen_supplier_number);
		$('#supplier_name').val(localStorage['commen_supplier_name']);
		$('#supplier_linkman').val(localStorage['commen_supplier_linkman']);
		$('#supplier_tel').val(localStorage['commen_supplier_tel']);
		localStorage.setItem('search_pinzhong_supply_number', temp_commen_supplier_number);

		$('.aui-tab ul li').click(function() {

			$(this).addClass('aui-hit').siblings().removeClass('aui-hit');
			$('.aui-panes>div:eq(' + $(this).index() + ')').show().siblings().hide();
		})
		$("#shxx").click();
	}

	temp_commen_product_number = localStorage.getItem("commen_product_number");
	if(temp_commen_product_number == null) {
		console.log("none") //不存在

	} else { //回到选择产品
		global_commen_product_number = temp_commen_product_number;
		localStorage.removeItem('commen_product_number');
		var product_obj = JSON.parse(localStorage['str_product_obj']);
		//					console.log(JSON.stringify(product_obj));
		for(var x in product_obj) {
			key = x; //键
			value = product_obj[x]; //值
			$('#' + key).val(product_obj[key]);
		}
		$('#search-input2').val(temp_commen_product_number); //产品编号
		$('#product_received').val(product_obj['product_not']); //收货数量默认=未收数量

	}

	show_storage();

});