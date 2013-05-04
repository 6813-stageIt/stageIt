<?php

$data = $_GET['contents'];
$name = $_GET['filename'];
$handle = fopen("tester.html", 'w+');
if($handle)
{
echo fwrite($handle, $data);
fclose($handle);

}

else{
	echo "failed";
}

?>