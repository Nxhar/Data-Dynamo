import React, { useRef, useState } from 'react';
import ChatbotIcon from '../../Assets/chatboticon.png';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { BeatLoader } from 'react-spinners';

function CalorieTracker({ user }) {
    const fileRef = useRef(null);
    const [file, setFile] = useState(null);
    const [selectedFile, setSelectedFile] = useState('');
    const [filePresent, setFilePresent] = useState(false);
    const [fileNotSent, setFileNotSent] = useState(true);
    const [message, setMessage] = useState('');
    const [loader, setLoader] = useState(false);
    const [response, setResponse] = useState('');

    const userIcon = user ? user.photoURL : '';

    const handleFileChange = (e) => {
        const currentFile = e.target.files[0];
        setFile(currentFile);
        setSelectedFile(currentFile.name);
        setFilePresent(true);
    };

    const handleSendFile = async () => {
        if (!file) {
            alert('Error, no file sent');
            return;
        }

        setFileNotSent(false);

        const formData = new FormData();
        formData.append('file', file);

        setLoader(true);

        try {
            const response = await fetch('http://127.0.0.1:5000/calorietrack', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            console.log(result[message])
            console.log(result + ' ' + result['message'])
            // Handle the response from the server
            if (result[message] !== 'error') {
                setResponse(result['message']);
            }
            setLoader(false);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div className='chatContainer'>
            {fileNotSent && (
                <div className='imageContainer'>
                    <img src={ChatbotIcon} alt="" />
                    <div className="imageText">Track your Calories and Nutrition facts about your food!</div>
                    <div className="mainContainer">
                        <input name='idio' ref={fileRef} type="file" style={{ display: 'none' }} onChange={handleFileChange} />
                        <label className='labelFor' htmlFor='idio' onClick={() => { fileRef.current.click() }}>
                            {!filePresent && 'Upload image here!'}
                            {filePresent && <img style={{ height: '400px', width: 'auto' }} src={file ? URL.createObjectURL(file) : ''} alt="Selected File" />}
                        </label>
                        <div className='sendbtn' onClick={handleSendFile}>Send</div>
                    </div>
                </div>
            )}

            {
                loader &&
                <div className="styleCal">
                    <img style={{ height: '200px', width: 'auto' }} src={file ? URL.createObjectURL(file) : ''} alt="Selected File" />
                    <BeatLoader size={40} color='#fff' />
                    <p>Getting Nutrition Facts Ready...</p>
                </div>
            }

            {response !== '' &&
                <div className="styleCal">
                    <img style={{ height: '200px', width: 'auto' }} src={file ? URL.createObjectURL(file) : ''} alt="Selected File" />
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                        {response}
                    </ReactMarkdown>
                </div>
            }
        </div>
    );
}

export default CalorieTracker;
