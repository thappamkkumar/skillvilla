<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

         <title>SkillVilla</title>

         
		 <style>
			body
			{
				 
				padding:0px ;
				margin:0px; 
				background-color:rgba(240,240,240,1);
				font-size:18px;
			}

			 
			*
			{
				box-sizing:border-box;
				padding:0px ;
				margin:0px;
			} 
			main
			{
				width:100%;
				height:auto;
				padding:0px 0px 0px 0px;
				background:rgba(255,255,255,1);
				color:rgba(0,0,0,1);
			}
			
			section
			{
				width:100%;
				height:auto;
				text-align:center;
				padding:20px 10px 20px 10px;;
			}
			.section_h1
			{
				padding:10px 0px 10px 0px; 
			}
			.section_h3
			{
				padding:10px 0px 10px 0px; 
				color:rgba(0,0,0,0.7);
			}
			.otp
			{
				font-size:50px;
				letter-spacing:4px;
				padding:30px 0px 30px 0px; 
			}
			@media only screen and (max-width:576px)
			{
				.otp{
					font-size:30px;
				}
			}
			.section_p
			{
				color:rgba(200,0,0,1);
			}
			
			 
			 
		 </style>
    </head>
    <body >  
		  
		<main>
			<section >
				<h1 class="section_h1" >Welcome to SkillVilla</h1>
				<h3 class="section_h3" >Here is your One Time Passsword (OTP) to validate your email address</h3>
				<p class="otp">{{$otp}}</p>
				<p class="section_p">Valid for {{$timeLimit}} minutes only</p>
			</section> 
		</main>
		 
		 
	 </body>
</html>