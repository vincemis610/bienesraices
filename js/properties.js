
addProperty = () => {
    let token = localStorage.getItem('_data');

    let imgs = document.querySelector('input[type="file"][multiple]');
    let lat = document.getElementById('lat').innerText;
    let lng = document.getElementById('lng').innerText;
    let title =  document.getElementById('titulo').value;
    let price = document.getElementById('precio').value;
    let city = document.getElementById('ciudad').value;
    let propietario = document.getElementById('propietario').value;

    let formdata = new FormData();
    for(let i = 0; i < imgs.files.length; i++){
        formdata.append('imgs', imgs.files[i]);
    }
    formdata.append("title", title);
    formdata.append("price", price);
    formdata.append("lat", `${lat}`);
    formdata.append("lng", `${lng}`);
    formdata.append("city", city);
    formdata.append("own", propietario);

    var opts = {
        method: 'POST',
        headers: {
            token: token
        },
        body: formdata,
        redirect: 'follow'
    };

    fetch(`https://haunted-mausoleum-45629.herokuapp.com/add`, opts)
    .then(response => response.json())
    .then(result => {
        window.location.href = 'propiedades.html'
    })
    .catch(error => console.log('error', error));
}

listProperties = () => {
    var opts = {
        method: 'GET',
        redirect: 'follow'
      };
      
      fetch(`${api}properties/`, opts)
        .then(response => response.json())
        .then(result => {
            console.log(result);
            let list = document.getElementById('listProperties');
            let properties = '';

            for (i = 0; i < result.length; i++) {
                properties = properties + `
                    <div class="col-12 col-md-4 p-3 d-flex justify-content-center">
                        <div class="card" style="width: 18rem;" >
                            <img class="card-img-top" src="${result[i].imgs[0]}" alt="Card image cap">
                            <div class="card-body">
                                <div><strong>${result[i].title}</strong></div>
                                <div><strong>City</strong>: ${result[i].city}</div>
                                <div><strong>Precio</strong>: ${result[i].price}</div>
                                <div class="my-2"><strong>Propietario</strong>: ${result[i].own}</div>        
                                <a href="propiedad.html?id=${result[i]._id}" class="btn btn-primary btn-block">Ver</a>
                            </div>
                        </div>
                    </div>`;
            };

            list.innerHTML = properties;

        })
        .catch(error => console.log('error', error));
}

getProperty = () => {
    let l = window.location.href.split("=");
    let li = l[1];
    console.log(li);

    var opts = {
        method: 'GET',
        redirect: 'follow'
      };
      
      fetch(`${api}properties/${li}`, opts)
        .then(response => response.json())
        .then(result => {
            console.log(result);
            let lat = result.property.lat;
            let lng = result.property.lng;
            let location = { lat: parseInt(lat), lng: parseInt(lng)}
            addMarker(location);

            let imgs = '';
            for (let i = 0; i < result.property.imgs.length; i++) {
                imgs = imgs + `<div class="col-12 my-3"><img src="${result.property.imgs[i]}" height="200px" width="auto"></div>`;
            }

           // console.log(imgs);

            document.getElementById('dataprop').innerHTML = `
            <div class="col-12">
                <h1>PROPIEDAD</h1>
                <br>
                <div class="mt-4">
                    <div><strong>Titulo/Tipo</strong>: ${result.property.title}</div>
                    <div><strong>Propietario</strong>: ${result.property.own}</div>
                    <div><strong>Precio</strong>: ${result.property.price}</div>
                    <div><strong>City</strong>: ${result.property.city}</div>
                    <div></div>
                </div>
            </div>
            <div class="mt-4" style="height:500px;overflow: scroll; overflow-x:hidden;">${imgs}</div>
            `;

        })
        .catch(error => console.log('error', error));
}