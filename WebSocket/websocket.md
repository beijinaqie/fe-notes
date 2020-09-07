


```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
	</head>
	<body>
		<input type="text" name="" id="text" value="请输入" />
		<input type="button" name="" id="submit" value="发送" />
	</body>
	<script type="text/javascript">
// 		
// 		let text = document.getElementById('text');
// 		let btn = document.getElementById('submit');
// 		var ws = new WebSocket('wss://echo.websocket.org/');
// 		
// 		btn.onclick = ()=>{
// 			ws.send(text.value)
// 		}
// 		
// 		// 建立 web socket 连接成功触发事件
// 		ws.onopen = function () {
// 		  console.log('websocket已打开...')
// 		};
// 		
// 		// 接收服务端数据时触发事件
// 		ws.onmessage = function (e) {
// 		  console.log(e.data)
// 		};
// 		
// 		// 断开 web socket 连接成功触发事件
// 		ws.onclose = function (e) {
// 		  console.log("websocket已关闭..."+ e.code + ' ' + e.reason + ' ' + e.wasClean);
// 		};
// 		
// 		ws.onerror = function(e){
// 			console.log('websocket发生错误...')
// 		}
	</script>
	<script type="text/javascript">
		let afterArr = [];
	 let beforeArr = [ {
  pay_vb: "1.13.6",
  signing_key: "BAR6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV",
  witness_account: "init2",
  last_confirmed_block_num: 118306,
  total_votes: 0,
},
{
  pay_vb: "1.13.4",
  signing_key: "BAR6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV",
  witness_account: "init3",
  last_confirmed_block_num: 118304,
  total_votes: 0,
},
{
  pay_vb: "1.13.5",
  signing_key: "BAR6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV",
  witness_account: "init4",
  last_confirmed_block_num: 118301,
  total_votes: "986962606049027",
},
{
  pay_vb: "1.13.11",
  signing_key: "BAR6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV",
  witness_account: "init5",
  last_confirmed_block_num: 118297,
  total_votes: 0,
},
{
  pay_vb: "1.13.8",
  signing_key: "BAR6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV",
  witness_account: "init6",
  last_confirmed_block_num: 118307,
  total_votes: "986962606049027",
},
{
  pay_vb: "1.13.3",
  signing_key: "BAR6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV",
  witness_account: "init7",
  last_confirmed_block_num: 118296,
  total_votes: 0,
},
{
  pay_vb: "1.13.2",
  signing_key: "BAR6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV",
  witness_account: "init8",
  last_confirmed_block_num: 118299,
  total_votes: 0,
},
{
  pay_vb: "1.13.1",
  signing_key: "BAR6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV",
  witness_account: "init9",
  last_confirmed_block_num: 118309,
  total_votes: 0,
},
{
  pay_vb: "1.13.10",
  signing_key: "BAR6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV",
  witness_account: "init10",
  last_confirmed_block_num: 118308,
  total_votes: 0,
}] 	
function sortArray(arr,value,sortType){
		return arr.sort(function(a,b){
			var value1 = a[value];
			var value2 = b[value];
			return sortType?value1 - value2:value2 - value1
		})
	}
	console.log(sortArray(beforeArr,'total_votes'))
</script>
</html>
```

