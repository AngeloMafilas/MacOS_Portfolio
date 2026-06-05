import React from 'react';
import { socials } from '../components/constants';
import WindowWrapper from '../hoc/WindowWrapper';
import useWindowsStore from '../store/window';
import { Send, ExternalLink } from 'lucide-react';

const Contact = () => {
    const { closeWindow } = useWindowsStore();

    return (
        <div className="flex flex-col w-[min(500px,94vw)] bg-white rounded-xl shadow-2xl border border-black/10 overflow-hidden font-sans">
            {/* Window Header */}
            <div className="window-header h-12 bg-[#f6f6f6] border-b border-gray-200 flex items-center px-4 shrink-0 select-none cursor-grab active:cursor-grabbing">
                {/* Traffic Lights */}
                <div className="flex gap-2.5 min-w-[70px] mr-4 shrink-0 group/lights">
                    <div 
                        onClick={() => closeWindow('contact')}
                        className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] border border-black/5 cursor-pointer hover:brightness-90 active:brightness-75 transition-all flex items-center justify-center group" 
                    >
                        <span className="opacity-0 group-hover/lights:opacity-100 text-[9px] text-black/60 font-black">✕</span>
                    </div>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] border border-black/5 cursor-pointer hover:brightness-90 active:brightness-75 transition-all flex items-center justify-center group">
                        <span className="opacity-0 group-hover/lights:opacity-100 text-[10px] text-black/60 font-black">−</span>
                    </div>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f] border border-black/5 cursor-pointer hover:brightness-90 active:brightness-75 transition-all flex items-center justify-center group">
                        <span className="opacity-0 group-hover/lights:opacity-100 text-[9px] text-black/60 font-black">＋</span>
                    </div>
                </div>
                <h2 className="flex-1 text-center text-[13px] font-semibold text-gray-700 pr-[70px]">Contact Me</h2>
            </div>

            <div className="p-8 flex flex-col items-center">
                {/* Profile Section */}
                <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden">
                        <img 
                            src="/images/wall_e_avatar.png" 
                            alt="Angelo" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = "https://ui-avatars.com/api/?name=Angelo&background=7c6ff7&color=fff";
                            }}
                        />
                    </div>
                    <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">Let's Connect</h1>
                <p className="text-[14px] text-gray-500 text-center max-w-[320px] mb-8 leading-relaxed">
                    Got an idea? A bug to squash? Or just wanna talk tech? I'm in.
                </p>

                {/* Social Grid */}
                <div className="grid grid-cols-2 gap-3 w-full">
                    {socials.map((social) => (
                        <a 
                            key={social.id}
                            href={social.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ backgroundColor: social.bg }}
                            className="flex items-center gap-3 p-3.5 rounded-xl text-white hover:brightness-110 transition-all group active:scale-[0.98]"
                        >
                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                <img src={social.icon} alt="" className="w-5 h-5 invert brightness-0" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-bold uppercase tracking-wider opacity-80 mb-0.5">Connect</p>
                                <p className="text-[13px] font-bold">{social.text}</p>
                            </div>
                            <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                    ))}
                </div>

                {/* Direct Contact Button */}
                <button 
                    onClick={() => window.location.href = 'mailto:hello@example.com'}
                    className="mt-8 w-full py-4 bg-[#007AFF] text-white rounded-xl font-bold text-[14px] shadow-lg shadow-blue-500/20 hover:bg-[#0066D6] transition-colors flex items-center justify-center gap-2 group active:scale-[0.99]"
                >
                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    Send me a Message
                </button>
            </div>
        </div>
    );
};

export default WindowWrapper(Contact, 'contact');
