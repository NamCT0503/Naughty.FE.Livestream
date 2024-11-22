import { Button, Dialog, DialogTitle, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";

const SettingStreamJSX = (props) => {
    const { onClose, currentTheme, tagsValue, open } = props;

    const [tags, setTags] = useState([]);
    const [inputSetting, setInputSetting] = useState({
        tag: ''
    });

    const inputTagRef = useRef();
    const tagAppendChild = useRef();

    // useEffect(() => {
    //     if(tagAppendChild.current && tags.length>=0){
    //         const newTag = document.createElement('div');
    //         newTag.textContent = tags.at(-1);
    //         newTag.className = 'tags-stream';
    //         tagAppendChild.current.appendChild(newTag);
    //     }
    // }, [tags]);

    const handleDataChange = (e) => {
        setInputSetting({
            ...inputSetting,
            [e.target.name]: e.target.value
        });
    }

    const handleKeyDown = (e) => {
        if(e.key === 'Enter' && inputSetting.tag!=='') {
            e.preventDefault();
            setTags((prevTags) => [...prevTags, inputSetting.tag]);
            setInputSetting({ tag: '' });

            const dom = inputTagRef.current;
            if(dom){
                dom.value = '';
            }
        }
    }

    const handleRemoveTag = (index) => {
        setTags((prevTags) => prevTags.filter((_, i) => i !== index));
    }

    console.log('tag: ', inputSetting.tag);
    console.log('all tag: ', tags)
    return(
        <Dialog open={open} onClose={onClose} scroll="paper" maxWidth="md" fullWidth>
            <DialogTitle>Cài đặt Phát trực tiếp</DialogTitle>
            <div className="container-tags setting-stream">
                <div className="area-title setting-stream">
                    <i className="fa-solid fa-tags"></i>
                    <div className="content setting-stream">
                        <span>Tag(s)</span>
                        <div>Thêm tag của bạn để có thể dễ dạng xác định stream hơn trong tương lai.</div>
                    </div>
                </div>
                <div 
                    className="area-content-input setting-stream"
                    style={{
                        borderLeft: currentTheme==='light'? '1px solid black': '1px solid white'
                    }}
                >
                    <div 
                        className="frame-content setting-stream"
                        style={{
                            boxShadow: currentTheme==='light'? 'rgba(0, 0, 0, 0.16) 0px 1px 4px': 'white 0px 1px 4px'
                        }}
                    >
                        <div ref={tagAppendChild} className="area-show-tags">
                        {tags.map((tag, index) => (
                            <div className="a-tag-stream">
                                <div key={index} className="tags-stream">
                                    {tag}
                                </div>
                                <i className="fa-solid fa-xmark" onClick={() => handleRemoveTag(index)}></i>
                            </div>
                        ))}
                        </div>
                        <div className="area-input-info">
                            <i className="fa-solid fa-tags"></i>
                            <input 
                                name="tag" 
                                ref={inputTagRef}
                                onChange={handleDataChange} 
                                onKeyDown={handleKeyDown}
                                // onKeyDown={}
                                type="text" 
                                style={{
                                    borderBottom: currentTheme==='light'? '1px solid black': '1px solid white'
                                }} 
                            />
                        </div>
                    </div>
                </div>
                <Button variant="contained">Lưu thay đổi</Button>
            </div>
        </Dialog>
    )
}

export default SettingStreamJSX;