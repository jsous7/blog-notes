const URL = "http://blog.zenycosta.com/api";

function deanonymizeApiRequest(body, arrayOfNamesIds) {
    let item = "";
    for (const id in arrayOfNamesIds){
        item += `<item>${arrayOfNamesIds[id]}</item>`;
    }
    var xmlEnvelop =`
    <Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
        <Body>
            <deannonymizer xmlns="http://blog.zenycosta.com/">
                <text xmlns="">${body}</text>
                <ids xmlns="">
                    ${item}
                </ids>
            </deannonymizer>
        </Body>
    </Envelope>`;
    
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: URL,
            method: 'POST',
            headers: {'Content-Type': 'text/xml;charset=utf-8'},
            dataType: "xml",
            data: xmlEnvelop,
            success: function(success) {
                resolve(success);
            },
            error: function(error) {
                reject(error);
            },
        });
    })
}

function findAll() {
    var xmlEnvelop =`
    <Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
        <Body>
            <findAll xmlns="http://blog.zenycosta.com/"></findAll>
        </Body>
    </Envelope>`;
    
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: URL,
            method: 'POST',
            headers: {'Content-Type': 'text/xml;charset=utf-8'},
            dataType: "xml",
            data: xmlEnvelop,
            success: function(success) {
                resolve(success);
            },
            error: function(error) {
                reject(error);
            },
        });
    })
}

function create(title, author, body) {
    var xmlEnvelop =`
    <Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
        <Body>
            <create xmlns="http://blog.zenycosta.com/">
                <title xmlns="">${title}</title>
                <author xmlns="">${author}</author>
                <body xmlns="">${body}</body>
            </create>
        </Body>
    </Envelope>`;
    
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: URL,
            method: 'POST',
            headers: {'Content-Type': 'text/xml;charset=utf-8'},
            data: xmlEnvelop,
            success: function(success) {
                resolve(success);
            },
            error: function(error) {
                reject(error);
            },
        });
    })
}

function deleteElement(id) {
    var xmlEnvelop =`
    <Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
        <Body>
            <delete xmlns="http://blog.zenycosta.com/">
                <id xmlns="">${id}</id>
            </delete>
        </Body>
    </Envelope>`;
    
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: URL,
            method: 'POST',
            headers: {'Content-Type': 'text/xml;charset=utf-8'},
            data: xmlEnvelop,
            success: function(success) {
                resolve(success);
            },
            error: function(error) {
                reject(error);
            },
        });
    })
}