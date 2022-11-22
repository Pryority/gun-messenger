import Head from "next/head";
import { useEffect, useState, useReducer } from "react";
import Gun from "gun";

const gun = Gun({
  peers: [
    "http://localhost:3030/gun"
  ]
});

const initialState = {
  messages: []
};

function reducer(state, message) {
  return {
    messages: [message, ...state.messages]
  };
}

export default function Home() {
  const [formState, setForm] = useState({
    name: "", message: ""
  });

  const [state, dispatch] = useReducer(reducer, initialState);

  const onChange = (e: any) => {
    setForm({...formState, [e.target.name]: e.target.value});
  };

  useEffect(()=> {
    const messages = gun.get("messages");
    messages.map().on(m => {
      dispatch({
        name: m.name,
        message: m.message,
        createdAt: m.createdAt
      });
    });
  },[]);

  const saveMessage = () => {
    const messages = gun.get("messages");
    messages.set({
      name: formState.name,
      message: formState.message,
      createdAt: Date.now()
    });
    setForm({
      name: "", message: ""
    });
  };

  return (
    <div className='flex flex-col grad-prim min-h-screen w-full justify-start items-start p-8'>
      <Head>
        <title>Gun Messenger</title>
        <meta name="description" content="Generated by Nemiwind" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={"flex flex-col space-y-16 w-full items-center"}>
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-col space-y-4 justify-end md:items-end">
            <a href="https://nextjs.org" className='text-4xl text-yellow-50 font-extrabold uppercase tracking-tighter italic flex'>Gun Messenger <span className='ml-2 mt-1 text-[18px] not-italic font-light'>(G.M.)</span></a>
            <h1 className={"font-base text-sm text-yellow-50"}>
              A simple messenger that stores encrypted message data with peers.
            </h1>
          </div>
        </div>

        <div className={"grid h-full space-y-4 md:space-y-8 lg:space-y-12 cursor-default items-between"}>
          {state.messages.map(message => (
            <div key={message.createdAt} className="p-2 flex justify-center items-center">
              <h2 className='t-2'>{message.message}</h2>
              <div className="grid grid-cols-2 w-full p-2">
                <h3 className="hover-1">
                  {message.name}
                </h3>
                <p>
                  {message.createdAt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}