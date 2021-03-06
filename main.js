function int(a,b=undefined){
    if(b==undefined){
        return parseInt(a);
    }
    else if(b==0){
        
        if(a.slice(0,2)=='0b'){
            return parseInt(a.slice(2),2)
        }
        else if(a.slice(0,2)=="0x"){
            return parseInt(a.slice(2),16)
        }
        else if(a.slice(0,2)=="0o"){
            console.log("oct")
            return parseInt(a.slice(2),8)
        }
        return parseInt(a,10)
    }
    else{
        return parseInt(a,b);
    }
}
// using element i have selected all the above boxes
element = document.getElementsByClassName("container");
var TotalCells= element.length;
var lengthOfTopRow= Math.floor(Math.sqrt(TotalCells));

percolatevar = document.getElementsByClassName("changetext");
// dict maps all the element to one which have been clicked odd number of times and other to 0
var dict = {}
// in adj map i have stored all the adjacent edges of the edge.
// the top edges have been connected to -1
// the bottom edges have been connected to -2
var adj = {}
// in visited i have stored all the egdes which have been visited during the dfs
var visited = {}
// in connected i have taken whether -1 is connected to -2 or not if yes i have used it to print the "system percolates"
var connected = {}
// now i am making dictionary time complexity is order n
for (var i = -2; i < element.length; i++) {
    dict[i] = 0;
}
// function reset starts here
function reset() {
    console.log("reset")
    for (var i = -2; i < element.length; i++) {
        dict[i] = 0;
        visited[i] = 0;
        connected[i] = 0;
        adj[i] = new Set();
    }
    for (var i = 0; i < element.length; i++) {
        element[i].style.backgroundColor = "black"
        // percolatevar[1].style.color="red";
    }
    function addedge(u, v) {
        adj[v].add(u);
        adj[u].add(v);
    }
    // i am adding unidirectional edges here they have been taken to stop backflush
    function addUniDirectEdge(u, v) {
        adj[u].add(v);
    }
    // adding all upper edges with -1
    for (var i = 0; i < lengthOfTopRow; i++) {
        addedge(i, -1);
    }
    // adding all lower edges with -2
    for (var i = element.length - lengthOfTopRow; i < element.length; i++) {
        addUniDirectEdge(i, -2);
    }
    count = 0
    watercells = 0;
    percolatevar[1].innerHTML = "System Does Not Percolate"
    percolatevar[0].innerHTML = "The percentage of active cells is:" + ((count / element.length) * 100).toFixed(2) + "%" + "<br>"

    percolatevar[0].innerHTML += "The percentage of water occupied cells is:" + ((watercells / element.length) * 100).toFixed(2) + "%"
}
var items;
function random(){
    myFunction();
    reset();
    var dictRandom={};
    let multiplier=1000000000;
    for(var i=0;i<element.length;i++){
        var randomCellMap=Math.floor(Math.random()*multiplier);
        
        dictRandom[i]=randomCellMap;
    }
    
    items = Object.keys(dictRandom).map(function(key) {
        return [ key,dictRandom[key]];
    });
    
    // Sort the array based on the second element
    items.sort(function(first, second) {
        if(second[1]!=first[1]){

            return second[1] - first[1];
        }
        else{
            return second[0]-first[0];
        }
    });
    low=1
    high=element.length;
    answer=0
    while(low<high){
        mid=int((low+high)/2)
        reset()
        flg=0;
        for(var i=0;i<=mid;i++){
            var cell=items[i][0];
            if(i==mid){

                ithbox(cell,color=1,dfs=1,update=0);
            }
            else{
                ithbox(cell,color=1,dfs=0,update=0);
            }
            
        }
        if (connected[-1] == connected[-2] & connected[-1] == 1) {
            flg=1
            
        }
        if(flg){
            high=mid;
            answer=mid
        }
        else{
            low=mid+1;
        }
    }
    console.log("answer",answer)
    reset()
    for(var i=0;i<=answer;i++){
        var cell=items[i][0];
        if(i==answer){

            ithbox(cell,color=1,dfs=1);
        }
        else{
            ithbox(cell,color=1,dfs=0);
        }
        if (connected[-1] == connected[-2] & connected[-1] == 1) {
            console.log('real answer is',i)
            break;
        }
    }


}

function ithbox(theta,color=1,dfs=1,update=1) {
    if(color){

        if (dict[theta] == 0) {
            // if the box has been visited odd times i make it green
            element[theta].style.backgroundColor = "green";
            dict[theta]++;
        }
        else if (dict[theta] == 1) {
            // if the box has been visited even times i make it black
            element[theta].style.backgroundColor = "black";
            dict[theta]--;
        }
    }
    if(dfs){

        // i am reseting adj connected and visited time order n
        for (var i = -2; i < element.length; i++) {
            visited[i] = 0;
            
        }
        // i am adding edges here
        function addedge(u, v) {
            adj[v].add(u);
            adj[u].add(v);
        }
        // i am adding unidirectional edges here they have been taken to stop backflush
        function addUniDirectEdge(u, v) {
            adj[u].add(v);
        }
        
        // adding all adjacent and upper edges
        for (var i = 0; i < element.length; i++) {
            if (dict[i] == 1 & dict[i + lengthOfTopRow] == 1) {
                addedge(i, i + lengthOfTopRow);
            }
            if (i % lengthOfTopRow != (lengthOfTopRow-1) & dict[i] == 1 & dict[i + 1] == 1) {
                addedge(i, i + 1);
            }
        }
        // the dfs starts here
        function printOne(v) {
            if (visited[v] == 0) {
                
                dfs(v);
            }
        }
        function dfs(v) {
            visited[v] = 1;
            
            if (v == -2) {
                connected[-1] = 1;
                connected[-2] = 1;
            }
            adj[v].forEach(printOne);
        }
        // dfs function ends here
        // we run a dfs through -1 and check if we reach -2
        dfs(-1);
        if(update){

            for (var i = 0; i < element.length; i++) {
                if (dict[i] == 1 & visited[i] == 1) {
                element[i].style.backgroundColor = "blue";
                
                }
                if (visited[i] == 0 & dict[i] == 1) {
                    element[i].style.backgroundColor = "green";
                }
            }
            var count = 0;
            var watercells = 0;
            for (var i = 0; i < element.length; i++) {
                if (dict[i] == 1) {
                    count++;
                }
                if (visited[i] == 1 && dict[i] == 1) {
                    watercells++;
                }
            }
            
            if (connected[-1] == connected[-2] & connected[-1] == 1) {
                percolatevar[1].innerHTML = "System Percolates"
            }
            else {
                percolatevar[1].innerHTML = "System Does Not Percolate"
            }
            percolatevar[0].innerHTML = "The percentage of active cells is:" + ((count / element.length) * 100).toFixed(2) + "%" + "<br>"
            
            percolatevar[0].innerHTML += "The percentage of water occupied cells is:" + ((watercells / element.length) * 100).toFixed(2) + "%"
            
        }
        
        
    }
}


function myFunction(){
    console.log("loaded");
    var string="";
    var n=+document.getElementById("length").value;
    console.log(n)
    for( var i=0;i<n*n;i++){
        string+='<div class="container"></div>'
    }
    for(var i=0;i<32;i++){
        string+="<br>";
    }
    document.getElementById("matrix").innerHTML=string;
    var widthofdevice=window.innerWidth
    var setMargin=n<=(3.8*widthofdevice/100);//margin disappers above certain n for different devices
 
    var margin=0
    if(setMargin){
        margin=100/(50*n)
    }
    let division=(100/n-2*margin).toString();


    for(var i=0;i<n*n;i++){
        document.getElementsByClassName("container")[i].style.width=division+"%"
        document.getElementsByClassName("container")[i].style.height=division+"vh"
        document.getElementsByClassName("container")[i].style.margin=margin+"%";
    }
    // using element i have selected all the above boxes
    element = document.getElementsByClassName("container");
    TotalCells= element.length;
    lengthOfTopRow= Math.floor(Math.sqrt(TotalCells));
    // using percolatevar i have selected all the boxes in which the text changes
    percolatevar = document.getElementsByClassName("changetext");
    // dict maps all the element to one which have been clicked odd number of times and other to 0
    dict = {}
    // in adj map i have stored all the adjacent edges of the edge.
    // the top edges have been connected to -1
    // the bottom edges have been connected to -2
    adj = {}
    // in visited i have stored all the egdes which have been visited during the dfs
    visited = {}
    // in connected i have taken whether -1 is connected to -2 or not if yes i have used it to print the "system percolates"
    connected = {}
    // now i am making dictionary time complexity is order n
    for (var i = -2; i < element.length; i++) {
        dict[i] = 0;
    }
}


