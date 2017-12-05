<!doctype html>
<html>
    <head>
        <title>Test JS PHP</title>

    </head>
    <body onLoad="test()">
        <div>php msg:</div>
        <div id="phptestmsg">
            <?php echo 'testmessage'; ?>
        </div>
        <br>
        <div>
            <script>
                function test(){
                    var text = document.getElementById("phptestmsg").innerHTML;
                    document.getElementById("documentshow").innerHTML = text;
                }
            </script>
        </div>
        <br>
        <div>Test MSg JS here:</div>
        <div id="documentshow"></div>
        <button type="" onclick="test()">Update</button>
    </body>
</html>