const URL = 'https://occupied-server.herokuapp.com';
// const URL = 'http://localhost:8080'
let logged = false;
let username = '';
let newUser = '';
let delUser = '';
let uuid = '';
let queueState = [];
let isOccup = false;
let modalTime = null;
let leftTime = 0;

function timeLeftModal(sec){
    $('#time').html(sec);
    $('#time-left-modal').show();
}

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
            if(data.queue.length > 0){
                $('#is-empty').hide();
                const firstInQueue = data.queue[0];
                const queue = data.queue.map((user)=>{
                    return("<p>"+user+"</p>");
                })
                if(isOccup)queue.shift();
                let secLeft = data.secondsLeft<0 ? 0 : data.secondsLeft;
                $('#time-left-wrapper').show();
                $('#time-left').html(secLeft);
                console.log('queue',queue[0],username);
                if(firstInQueue==username){
                    $('#your-turn').show();
                    if(secLeft == 30 || secLeft == 29){
                        timeLeftModal(30);
                        leftTime = secLeft;
                    } else if(secLeft == 20 || secLeft == 19){
                        timeLeftModal(20);
                        leftTime = secLeft;
                    } else if(secLeft == 10 || secLeft == 9){
                        timeLeftModal(10);
                        leftTime = secLeft;
                    }
                    if(leftTime - secLeft > 3)$("#time-left-modal").hide();
                }else{
                    $('#your-turn').hide();
                    $("time-left-modal").hide();
                }
                $('#queue').html(queue);
                $('#queue').show();
            }else{
                $('#your-turn').hide();
                $('#is-empty').show();
                $('#queue').hide();
                $("#time-left-wrapper").hide();
            }
            console.log(data);
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
        data: delUser,
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

$(document).ready(function(){

    $("#main-app").hide();
    $(".server-err").hide();
    $(".username-err").hide();
    $("#new-user-panel").hide();
    $("#delete-user-panel").hide();
    $("#in-queue-err").hide();
    $("#time-left-modal").hide();
    $("#time-left-wrapper").hide();
    $('#your-turn').hide();

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
        $("#delete-user-panel").hide();
        $(".server-err").hide();
        $("#login-panel").show();
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
