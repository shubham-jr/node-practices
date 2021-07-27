import axios from 'axios';
export const login=async (email,password)=>{
	try{
		console.log('login.js');
		const res=await axios({
		method:'POST',
		url:'http://127.0.0.1:3000/api/v1/users/login',
		data:{
			email,
			password
		}
	})
		console.log(res);
	if(res.data.status==='success')	
		{
			alert('Logged In successfully')
		console.log(res);
		window.setTimeout(()=>{
		location.assign('/')
	},1500)
	
		}else if(res.data.status==='fail')
		alert(res.data.message)
	}catch(err){
		console.log(err)
	}
}

export const logout=async()=>{
	try{
     
     const res=await axios({
     	method:'GET',
     	url:'http://127.0.0.1:3000/api/v1/users/logout',
     })
     if(res.data.status==='success')
     {
     	location.reload(true);
     }

	}catch(err){
     showAlert('error','error logging out try again')
	}
}


