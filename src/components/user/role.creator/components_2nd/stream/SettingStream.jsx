import { Button, Dialog, DialogTitle, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { API_Nanostream, API_SERVER } from "../../../../../router/router.server";
import { sendStreamReq } from "../../../../../service/service.api";

const SettingStreamJSX = (props) => {
    const { onClose, currentTheme, stream, open } = props;

    const [tags, setTags] = useState([]);
    const [inputSetting, setInputSetting] = useState({
        tag: ''
    });

    const inputTagRef = useRef();
    const tagAppendChild = useRef();

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

    const handleChangeTag = async () => {
        if(tags.length===0) {
            onClose();
            return alert('Chưa thực hiện thay đổi nào!');
        }

        const url = API_Nanostream.CHANGE_TAGS.replace(':id', stream.streamId);
        const res = await sendStreamReq(url, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tags: tags})
        });

        if(res.ok){
            return alert('Cập nhật tag cho stream thành công!');
        }

        return alert('Lỗi quá trình cập nhật tag!');
    }

    // console.log('tag: ', inputSetting.tag);
    // console.log('all tag: ', tags);
    // console.log('stream: ', stream);
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
                <Button variant="contained" onClick={handleChangeTag}>Lưu thay đổi</Button>
            </div>
        </Dialog>
    )
}

export default SettingStreamJSX;