const i = (frame) => frame.parent || frame.contentWindow || frame;

async function pingThePong(elem) {
    let intervalId = setInterval(() => {
        console.log("ping");
        elem.contentWindow.postMessage("ping", "*")
    }, 40)

    await new Promise(resolve => {
        window.addEventListener('message',function cb(e) {
            console.log("got back message", e.source === window ,e.source === elem.contentWindow,e.data);

            if (e.data === "pong" && e.source === elem.contentWindow) {
                resolve() 
                clearInterval(intervalId);
                window.removeEventListener('message',cb);
            }
        });
    });
}

async function pongThePing() {
    await new Promise(function(res) {
        window.addEventListener("message", function cb(e) {
            if(e.data === "ping") {
                res()
                window.parent.postMessage("pong","*")
                window.removeEventListener("message",cb)
            }    
        })
    })
}

const messageQueue = {};

function mess(elem) {
    
    const postMessage = async (message, origin, transferable) => {
        if (typeof messageQueue[elem] !== "object") {
            messageQueue[elem] = [];
            await pingThePong(elem);
            window.addEventListener("message", (e) => {
                if((!messageQueue[elem][e.data.mId]) || e.source !== elem.contentWindow) return;
                const [cb] = messageQueue[elem].splice(e.data.mId,1);
                cb(e.data.data);
            })
        }

        return new Promise(resolve =>{
            const cb = data =>resolve(data)
            const mId = messageQueue[elem].push(cb) -1;
            const wrapObj = { mId, data: message }
            elem.contentWindow.postMessage(wrapObj, origin, transferable);

        })
    }
    const on = async (cb) => {
        await pongThePing()
        console.log("pre on ", elem === window);
        elem.addEventListener("message", (e) => {
            console.log("--on",e.data, e.source === elem.parent);
            if (typeof e.data.mId === "undefined") return;
            const response = (messageData, origin, transferable) => elem.parent.postMessage({mId:e.data.mId, data: messageData},origin,transferable)
            cb(e,response)
        })
    };

    return { on, postMessage };
}

