import React, { useRef, useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { executeCode } from '../assets/api';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
const socket = io.connect("http://localhost:6969/")
const CodeEditor = () => {
  const nav = useNavigate();  
  const [value, setValue] = useState('');
  const [output, setOutput] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [leave,setLeave] = useState(false);
  const editorRef = useRef();
  const code = localStorage.getItem('roomCode');
  const client = localStorage.getItem('userId');
  const leaveRoom = () => {
    socket.emit('leave-room', { code, client });
    localStorage.removeItem('roomCode');
    localStorage.removeItem('userId');
    console.log(`${client} left room ${code}`);
    setLeave(!localStorage.getItem('leave'));
    localStorage.removeItem('leave');
  };
  useEffect(() => {
    setLeave(localStorage.getItem('leave'));
    if(!code || !client){
      alert('Please login and join a room first');
      nav('/home');
      return;
    }
    const dummyQuestions = [
      {
        title: "Two Sum",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.You may assume that each input would have exactly one solution, and you may not use the same element twice.You can return the answer in any order."
      },
      {
        title: "Reverse a Linked List",
        description: "Reverse a singly linked list."
      },
      {
        title: "Valid Parentheses",
        description: "Check if a string containing just the characters '(', ')', '{', '}', '[' and ']' is valid."
      }
    ];
    setQuestions(dummyQuestions);
    socket.emit('join-room', { roomCode: code, client });

    socket.on('editor', (change)=>{
      if(change !== value){
        setValue(change);
      }
    })
    socket.on('leave-room', ({ code, client }) => {
      localStorage.removeItem('roomCode');
      localStorage.removeItem('userId');
      console.log(`${client} left room ${code}`);
    });
    return () => {
      socket.off('editor');
    };
  }, [value,code]);

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const fn = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;
    try {
      const { run: result } = await executeCode(sourceCode);
      setOutput(result.output);
    } catch (error) {
      console.error(error);
    }
  };
  // 
  const nextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length); // Loop back to first question after last one
  };

  const currentQuestion = questions[currentQuestionIndex];
  const handleEditor = (value) =>{
    setValue(value);
    socket.emit('editor',{change:value,code});
  }
  return (
    (leave)? (<div className="flex flex-col items-center justify-center w-full h-screen p-4">
      <div className="flex w-full justify-between mb-4">
        <div className="w-1/3 p-4 bg-gray-100 border rounded-md">
          <h2 className="text-xl font-bold mb-2">{currentQuestion?.title}</h2>
          <p>{currentQuestion?.description}</p>
          <button
            className="mt-4 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={fn}
          >
            Run Code
          </button>
          <button
            className="mt-2 ml-2 p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            onClick={nextQuestion}
          >
            Next Question
          </button>
        </div>

        {/* Right Side: Code Editor */}
        <div className="w-2/3 p-4">
        {/* <button type='button' onClick={leaveRoom}>Leave Room</button> */}
          <Editor
            height="65vh"
            width="100%"
            theme="vs-dark"
            defaultLanguage="java"
            defaultValue={value}
            onMount={onMount}
            value={value}
            onChange={handleEditor}
          />
        </div>
      </div>

      {/* Output */}
      {output && (
        <div className="w-full mt-4 p-4 bg-gray-200 rounded-md">
          <p>{output}</p>
        </div>
      )}
    </div>):
    (
      <div>You left the room</div>
    )
  );
};

export default CodeEditor;
