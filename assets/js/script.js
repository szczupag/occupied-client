const URL = 'https://occupied-server.herokuapp.com';
let logged = false;
let username = '';
let newUser = '';
let delUser = '';
let uuid = '';
let queueState = [];
let isOccup = false;

function InfiniteGetData(){
    $.ajax({
        url: URL+'/queue/status',
        success: function(data){
            queueState = data.queue;
            if(data.occupied != false){
                isOccup = true;
                $('#not-occupied').hide();
                $('#occupied').html(queueState[0]);
                $('#occupied').show();
            }else{
                isOccup = false;
                $('#not-occupied').show();
                $('#occupied').hide();
            }
            if(data.queue != []){
                $('#is-empty').hide();
                let queue = (data.queue).map((user)=>{
                    return("<p>"+user+"</p");
                })
                if(isOccup)queue.shift();
                $('#queue').html(queue);
                $('#queue').show();
            }else{
                $('#is-empty').show();
                $('#queue').hide();
            }
            console.log(data.queue, queueState);
        },
        error: function(xhr, ajaxOptions, thrownError) {
            alert(thrownError);
        }
    });
};

function userExists(){
    $.ajax({
        type: 'POST',
        url: URL+'/users/exists',
        contentType: "application/json",
        dataType: "json",
        data: username,
        success: function(data){
            if(data.exists == true)
            {
                $("#login-panel").hide();
                $("#main-app").show();
                $("#is-empty").show();
                console.log(data)
            }
            else
            {
                $(".username-err").show();
                console.log(data)
            }
        }
    }).fail(function(err){
        $(".server-err").show();
    });
}

function addToQueue(){
    $.ajax({
        type: 'POST',
        url: URL+'/queue/add',
        contentType: "application/json",
        data: username,
        success: function(data){
            console.log("[ADD]",data)
            if(data.includes("already in the queue")>0){
                $("#in-queue-err").show();
            }else {
                $("#in-queue-err").hide();
            }
        }
    });
}

function addNewUser(){
    const uuidSplt = uuid.split(",").map(Number);
    $.ajax({
        type: 'POST',
        url: URL+'/users',
        contentType: "application/json",
        data: JSON.stringify({ name: newUser, uuid: uuidSplt }),
        success: function(data){
            console.log("[ADD]",data);
            $("#new-user-panel").hide();
            $("#login-panel").show();
            $(".server-err").hide();
        }
    }).fail(function(err){
        $(".server-err").show();
    });
    console.log("[NEW]",newUser,uuidSplt);
}

function deleteUser(){
    $.ajax({
        type: 'DELETE',
        url: URL+'/users',
        contentType: "application/json",
        data: JSON.stringify({ delUser }),
        success: function(data){
            console.log("[ADD]",data);
            $("#delete-user-panel").hide();
            $("#login-panel").show();
            $(".server-err").hide();
        }
    }).fail(function(err){
        $(".server-err").show();
    });
}

function isOccupied(){
    $.ajax({
        type: 'GET',
        url: URL+'/queue/status',
        contentType: "application/json",
        dataType: "json",
        success: function(data){
            occupiedData = data;
            if(data.occupied != false){
                $('#not-occupied').hide();
                $('#occupied').html('dupooo',queueState[0]);
                $('#occupied').show();
            }else{
                $('#not-occupied').show();
                $('#occupied').hide();
            }
            if(data.queue != []){
                $('#is-empty').hide();
                $('#queue').html(data.queue);
                $('#queue').show();
            }else{
                $('#is-empty').show();
                $('#queue').hide();
            }
            console.log(data.queue);
        }

    }).fail(function(err){
        console.log('[GET QUEUE]',err.responseText)
    })
}

$(document).ready(function(){

    $("#main-app").hide();
    $(".server-err").hide();
    $(".username-err").hide();
    $("#new-user-panel").hide();
    $("#delete-user-panel").hide();
    $("#in-queue-err").hide();

    setInterval(()=>{InfiniteGetData()},2000);

    $("#login").click(function(){
        username = $('#username').val();
        userExists();
    });

    $("#add-btn").click(function(){
        addToQueue();
    });

    $("#new-user-btn").click(function(){
        $("#login-panel").hide();
        $(".server-err").hide();
        $("#new-user-panel").show();
    });

    $("#login-panel-btn").click(function(){
        $("#new-user-panel").hide();
        $(".server-err").hide();
        $("#login-panel").show();
    });

    $("#login-panel-btn2").click(function(){
        $("#main-app").hide();
        $("#login-panel").show();
    });

    $("#register").click(function(){
        newUser = $('#new-user').val();
        uuid = $('#uuid').val();
        addNewUser();
    })

    $("#delete").click(function(){
        delUser = $('#delete-user').val();
        deleteUser();
    })

    $("#login-panel-btn3").click(function(){
        $("#delete-user-panel").hide();
        $(".server-err").hide();
        $("#login-panel").show();
    });

    $("#delete-user-btn").click(function(){
        $("#login-panel").hide();
        $(".server-err").hide();
        $("#delete-user-panel").show();
    });


});
