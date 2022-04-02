import React, { FunctionComponent } from 'react';
const UserMessageInput: FunctionComponent<{
  handleInput: (e: any) => void;
  handleKeyPress: (e: any) => void;
  message: string;
  handleSending: () => void;
}> = ({ handleInput, handleKeyPress, message, handleSending }) => {
  return (
    <div
      id="input-container"
      className={'sticky bottom-0 flex w-full flex-row gap-5'}
    >
      <input
        type={'text'}
        id={'user-message'}
        placeholder={'Your Message'}
        className={'h-full w-full rounded-md border-2 px-2'}
        onChange={handleInput}
        onKeyPress={handleKeyPress}
        value={message}
        autoComplete="off"
      />
      <button
        onClick={handleSending}
        className={'mr-5 rounded-md bg-sky-600 px-5 text-white'}
      >
        Send
      </button>
    </div>
  );
};

export default UserMessageInput;
