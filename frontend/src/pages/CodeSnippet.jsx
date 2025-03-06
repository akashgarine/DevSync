import React from 'react';

const CodeSnippet = () => {
  return (
    <div className="w-2/3 bg-gray-900 p-4 rounded">
      <div className="flex justify-between items-center mb-4">
        <span className="text-xl font-bold text-white">CodeCollab Editor</span>
        <button className="bg-purple-500 text-white px-4 py-2 rounded">Run Code</button>
      </div>
      <div className="text-white">
        <h3 className="text-lg font-bold mb-2">Problem: Two Sum</h3>
        <p className="mb-2">Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.</p>
        <p className="mb-2">Example:</p>
        <p className="mb-2">Input: nums = [2,7,11,15], target = 9</p>
        <p className="mb-2">Output: [0,1]</p>
      </div>
      <div className="bg-gray-800 p-4 rounded">
        <pre className="text-white">
          <code>
            {`
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
}
            `}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default CodeSnippet;
