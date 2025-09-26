
const avatarGenrator = ()=>{
    const funEmoji = ["Aiden","Caleb","Nolan","Robert","Destiny","Mackenzie","Liam","Adrian"]
    const idx = Math.floor(Math.random() * funEmoji.length);
    const profilePic = `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${funEmoji[idx]}`;
    return profilePic;
}

export default avatarGenrator