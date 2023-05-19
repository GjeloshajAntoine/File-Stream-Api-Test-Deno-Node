async function pingThePong(elem) {
    let intervalId = setInterval(() => {
        elem.contentWindow.postMessage("ping", "*")
    }, 1)

    await new Promise(resolve => {
        elem.contentWindow.addEventListener('message',function cb(e) {
            if (e.data === "pong" ) {
                resolve() 
                clearInterval(intervalId);
                elem.contentWindow.removeEventListener('message',cb);
            }
        });
    });
}

async function pongThePing() {
    await new Promise(function(res) {
        window.addEventListener("message", function cb(e) {
            if(e.data === "ping") {
                res()
                window.postMessage("pong","*")
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
            elem.contentWindow.addEventListener("message", (e) => {
                const wrapObj = e.data;
                const mId = wrapObj.mId;
                if((!messageQueue[elem][mId]) || e.source !== elem.contentWindow) return;
                const [cb] = messageQueue[elem].splice(mId,1);
                cb(wrapObj.data);
            })
        }

        const waitForMessage = (cb) => {
            const mId = messageQueue[elem].push(cb) -1;
            const wrapObj = { mId, data: message }
            elem.contentWindow.postMessage(wrapObj, origin, transferable);
        }
        return new Promise(resolve => waitForMessage(data =>resolve(data)))
    }
    const on = async (cb) => {
        elem.addEventListener("message", (e) => {
            if (typeof e.data.mId === "undefined") return;
            e.data = e.data.data
            const response = (messageData, origin, transferable) => elem.postMessage({mId:e.data.mId, data: messageData},origin,transferable)
            cb(e,response)
        })
        await pongThePing()
    };

    return { on, postMessage };
}

