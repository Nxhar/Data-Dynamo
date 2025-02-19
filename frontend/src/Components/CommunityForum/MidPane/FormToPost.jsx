import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import { useState } from 'react';
import { serverTimestamp, FieldValue, addDoc, collection } from 'firebase/firestore';
import { db, storage } from '../../../Firebase/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import {v4} from 'uuid'



function FormToPost({ user, posts, setPosts  }) {
  const userIcon = user.photoURL;

  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };

  return (
    <div>
      <div className="outer-text-container">
        <img className="profile-icon" src={userIcon} alt="" />
        <div className="textbox" onClick={toggleModal}>
          <EditIcon />
          Post What's on your Mind
        </div>
      </div>
      {modal && <Modal toggleModal={toggleModal} user={user} posts={posts} setPosts={setPosts} />}
    </div>
  );
}


function Modal({ toggleModal, user, posts, setPosts }) {
  const [postTitle, setPostTitle] = useState('');
  const [postDesc, setPostDesc] = useState('');
  const [image, setImage] = useState(null);
  

  const uploadImage = async (file) => {
    if(file){
    try {
      const storageRef = ref(storage, 'images/' + file.name + v4());
      const snapshot = await uploadBytes(storageRef, file);
  
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('Got download url' + downloadURL)
      

      return downloadURL;

    } catch (error) {
      console.error('Error uploading file:', error);
      return '';
    }
  } else { return ''; }

  };

  const handleCreatePost = async () => {
    if (postTitle.trim() === '' || postDesc.trim() === '') {
      return;
    }
  
    let imageURL = '';
  
    if (image) {
      imageURL = await uploadImage(image);
    }
  
    const newPost = {
      uid: user.uid,
      creator: user.displayName,
      photoUrl: user.photoURL,
      title: postTitle,
      description: postDesc,
      imageUrl: imageURL,
      timestamp: serverTimestamp(),
    };
  
    setPosts([...posts, newPost]);
  
    try {
      // LOGIC TO CREATE POST THRU FIREBASE FIRESTORE
      
      const docRef = await addDoc(collection(db, 'posts'), newPost);
  
      console.log('Document written with ID: ', docRef.id);
    } catch (err) {
      console.error(err);
    }
  
    setPostDesc('');
    setImage(null);
    setPostTitle('');
    
  
    toggleModal();
  };
  

  return (
    <>
      <div className="modal">
        <div onClick={toggleModal} className="overlay"></div>
        <div className="modal-content">
          <h2>Add a new post</h2>
          <div className="row_1">
            <img className="profile-icon" src={user.photoURL} alt="" />
            <input
              type="text"
              value={postTitle}
              placeholder="What do you want to discuss about?"
              onChange={(e) => setPostTitle(e.target.value)}
            />
          </div>
          <textarea
            className="row_2_textarea"
            placeholder="Describe more about your thoughts here"
            value={postDesc}
            onChange={(e) => setPostDesc(e.target.value)}
          />
          <div className="row_3">
            <label htmlFor="fileInput">
              <ImageIcon fontSize="large" className="fileInput" />
              <input
                style={{ display: 'none' }}
                type="file"
                id="fileInput"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
              />
            </label>
            <div className="button" onClick={handleCreatePost}>
              Create Post
            </div>
          </div>
          <div className="row_4">
            {image && (
              image.type.startsWith('image/') ? (
                <img src={URL.createObjectURL(image)} style={{ maxHeight: '150px' }} alt="Selected" />
              ) : (
                <span style={{ backgroundColor: '#eee', display: 'flex' }}>File : {image.name}</span>
              )
            )}
          </div>
          <CloseIcon className="closeBtn" onClick={toggleModal} />
        </div>
      </div>
    </>
  );
}

export default FormToPost;
