<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
				<meta name="description" content="Join our dynamic platform where you can post and view updates, explore and apply for jobs, post job opportunities, and enjoy live chat and streaming options. Connect, engage, and grow with our versatile community app.">
				 
        <title>SkillVilla</title> 
				
        <link rel="icon" href="{{ asset('images/logo-icon.png') }}"  type="image/png"  > 
				
       @viteReactRefresh
		@vite(['resources/css/app.css', 'resources/js/app.js'])
  </head>
    <body>
		 
			<div id="app"> </div>
			  
		</body>
</html>
