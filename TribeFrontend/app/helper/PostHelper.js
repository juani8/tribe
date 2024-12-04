import MockUpPostData from 'models/MockUpPostData'; 

function GetPostById(postId) {
  return MockUpPostData.find(post => post.postId === postId);
}

module.exports = GetPostById;