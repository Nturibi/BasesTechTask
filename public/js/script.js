const userDataForm = document.querySelector("#userData");
userData.addEventListener("submit", function(event){
  event.preventDefault();

  const name = document.querySelector("#username").value;
  const allYears = document.querySelectorAll("input[name='rr']");
  const major = document.querySelector("#major").value;

  let userYear = ""
  for (const item of allYears){
    if (item.checked) userYear = item.value;
  }
  const password = document.querySelector("#psw").value;
  const cPassword = document.querySelector("#cpsw").value;

  const errorDiv = document.querySelector("#error");
  if (password !== cPassword){
    errorDiv.textContent= "Passwords must match!";
    return;
  }else{
    errorDiv.textContent= "";
  }
  const message = {
    username: name,
    year: userYear,
    password: password,
    major: major
  }
  sendData(message);
});

async function sendData(message){
  console.log("Getting the mess");
  console.log(message);
  const fetchOptions = {
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(message)
				};

   const resp = await fetch('/adduser',fetchOptions);
   const jsRes = await resp.json();
   console.log("Reply");
   console.log(jsRes);
  const errorDiv = document.querySelector("#error");

   if (jsRes.isTaken){
     errorDiv.textContent = "The user already exists.";
     document.querySelector("#notification").textContent="";
   }else{
     let names = "";
     let classMatesPresent = true;
     for (const item of jsRes.classMates){
       if (item.username !== message.username){
         names += " "+ item.username;
       }
     }
     if (names === "") classMatesPresent= false;

     const notificationDiv  = document.querySelector("#notification");
     if (classMatesPresent){
       notificationDiv.textContent= "Bases members also in your year: "+ names;
     }else{
       notificationDiv.textContent= "There are no Bases members in your class";
     }

   }
}
