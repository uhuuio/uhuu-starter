'use strict';

const newline = '\n';

function nl2br(text : any) {
    if (typeof text === 'number') {
        return text;
    } else if (typeof text !== 'string') {
        return '';
    }

    let lines = text.split(newline);

    return lines.map((line, index) => (
           <span key={index}>
                {line}
                <br/>
            </span>
    ));
}

export default nl2br;