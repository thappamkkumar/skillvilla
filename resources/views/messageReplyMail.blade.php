<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>SkillVilla - Reply to Your Message</title>

	<style>
		body {
			margin: 0;
			padding: 0;
			background-color: rgba(240, 240, 240, 1);
			font-size: 18px;
			 
		}

		* {
			box-sizing: border-box;
		}

		main {
			width: 100%;
			background: #fff;
			color: #000;
		}

		section {
			width: 100%;
			padding: 30px 15px;
			text-align: center;
		}

		.section_h1 {
			padding: 10px 0;
			font-size: 26px;
		}

		.section_h3 {
			padding: 10px 0;
			color: rgba(0, 0, 0, 0.7);
			font-size: 18px;
		}

		.reply-title {
			margin-top: 30px;
			font-size: 20px;
			font-weight: bold;
			color: #222;
		}

		.message-box {
			padding: 20px;
			margin: 20px auto;
			max-width: 600px;
			background: #f1f1f1;
			border-left: 5px solid #333;
			text-align: left;
			font-size: 17px;
			white-space: pre-line;
		}

		.section_p {
			margin-top: 20px;
			font-size: 16px;
			color: rgba(100, 100, 100, 0.8);
		}

		@media only screen and (max-width: 576px) {
			.message-box {
				font-size: 15px;
				padding: 15px;
			}
		}
	</style>
</head>
<body>

<main>
	<section>
		<h1 class="section_h1">Hello {{ $name }},</h1>
		<h3 class="section_h3">We received your message. Thank you for reaching out to us!</h3>

		<div class="reply-title">Our Reply:</div>

		<div class="message-box">
			{{ $reply }}
		</div>

		<p class="section_p">If you need further assistance, feel free to respond to this email.</p>
	</section>
</main>

</body>
</html>
