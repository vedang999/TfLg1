import React, { useState, useEffect } from 'react';
import './index.css'; // Ensure you have styles defined for your white UI
import logo from './logo.svg';
import micIcon from './mic.svg';

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('Hi, how can I help?');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState('');

  useEffect(() => {
    // Set background color for white UI
    document.body.style.backgroundColor = '#FFFFFF';
    document.body.style.margin = '0';
    
    return () => {
      document.body.style.backgroundColor = '';
      document.body.style.margin = '';
    };
  }, []);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const result = event.results[current];
        const text = result[0].transcript;
        setTranscript(text);
        if (result.isFinal) {
          handleSearch(text);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      window.recognition = recognition;
    }
  }, []);

  const handleSearch = async (searchText) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // setResponse(`Search results for: ${searchText}`);
    // setSearchResults(`Here are the results for "${searchText}"`);
    setIsLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (transcript.trim()) {
      handleSearch(transcript);
    }
  };

  const toggleListening = () => {
    if (!isListening) {
      window.recognition?.start();
      setIsListening(true);
      setResponse('');
      setSearchResults('');
    } else {
      window.recognition?.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white text-black flex items-center justify-center">
      <style jsx>{`
        .voice-gradient {
          background: linear-gradient(
            to right,
            #4285f4 0 25%,
            #ea4335 25% 50%,
            #fbbc05 50% 75%,
            #34a853 75% 100%
          );
          animation: voice 2s ease infinite alternate;
        }

        .voice-gradient.blur {
          filter: blur(16px);
        }

        @keyframes voice {
          0% {
            background-size: 200%;
          }
          100% {
            background-size: 100%;
          }
        }
      `}</style>

      <div className="relative w-full max-w-xl px-4">
        {/* Main Content */}
        <div className="flex flex-col items-center justify-center">
          {!isListening ? (
            <form onSubmit={handleSubmit} className="w-full">
              <div className="bg-gray-200 rounded-full px-4 sm:px-6 py-3 flex items-center w-full">
              <img src={logo} alt="Google Logo" className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />

                <input
                  type="text"
                  className="bg-transparent flex-1 focus:outline-none text-black ml-4"
                  placeholder="Search..."
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                />
                <button
                  type="button"
                  onClick={toggleListening}
                  className="hover:bg-gray-300 rounded-full transition-colors duration-200 p-1"
                >
                  <img src={micIcon} alt="Mic Icon" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />

                </button>
              </div>
            </form>
          ) : (
            <div className="text-center w-full">
              {transcript ? (
                <div className="text-xl sm:text-2xl md:text-3xl break-words">
                  {transcript}
                </div>
              ) : (
                <div className="text-gray-400 text-lg sm:text-xl md:text-2xl">
                  Listening...
                </div>
              )}
              <button onClick={toggleListening} className="mt-4">
                <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-red-500 rounded-full animate-pulse mx-auto" />
              </button>
            </div>
          )}

          {/* Response Area */}
          <div className="text-center mt-4">
            {isLoading ? (
              <div className="flex justify-center space-x-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            ) : searchResults ? (
              <div className="text-sm sm:text-base md:text-lg break-words">
                {searchResults}
              </div>
            ) : null}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="fixed left-0 right-0 bottom-24">
          <div
            className={`mx-auto transition-all duration-500 ease-in-out ${
              isListening ? 'w-11/12' : 'w-2/5'
            }`}
          >
            <div className="relative h-1 overflow-visible">
              {isListening ? (
                <>
                  <div className="absolute inset-0 voice-gradient blur" />
                  <div className="absolute inset-0 voice-gradient" />
                </>
              ) : (
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    background: 'linear-gradient(to right, #4285f4 0 25%, #ea4335 25% 50%, #fbbc05 50% 75%, #34a853 75% 100%)',
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;
