window.onload = function () {
    fetch("website/images/Logo.png")
        .then(res => {
            return res.blob()
        })
        .then(blob => {
            const img = URL.createObjectURL(blob);
            // Do whatever with the img
            document.getElementById('logo').setAttribute('src', img);
        })
}