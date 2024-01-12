const next=document.querySelector('.next')
const prev=document.querySelector('.prev')
const comment=document.querySelector('#list-comment')
const commentItem=document.querySelectorAll('#list-comment .item')
var translateY=0;
var count= commentItem.length
next.addEventListener('click',function (event){
    event.preventDefault()
    if(count==1)
    {
        return false
    }
    translateY+=-350
    comment.style.transform=`translateY(${translateY}px)`
    count--
})
prev.addEventListener('click',function(event){
    event.preventDefault()
    if(count==3){
        return false
    }
    translateY+=350
    comment.style.transform=`translateY(${translateY}px)`
    count++
})
document.addEventListener('DOMContentLoaded', function() {
    const showChatButton = document.getElementById('showChat');
    const closeChatIcon = document.getElementById('closeChat');
    const chatBox = document.getElementById('chatBox');
  
    // Toggle chat box display on button click
    showChatButton.addEventListener('click', function() {
      if (chatBox.style.display === 'none' || chatBox.style.display === '') {
        chatBox.style.display = 'block';
      } else {
        chatBox.style.display = 'none';
      }
    });
    closeChatIcon.addEventListener('click', function() {
      chatBox.style.display = 'none';
    });
  });