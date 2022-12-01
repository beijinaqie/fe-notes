console.log(navigator.mediaDevices)

navigator.mediaDevices.enumerateDevices().then(res => {
  console.log(res);
})