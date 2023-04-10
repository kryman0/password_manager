const information = document.getElementById('info')

information.innerText = `This app is using chrome: ${versions.chrome()}, node: ${versions.node()} and electron: ${versions.electron()}`

const func = async () => {
    const response = await versions.ping()
    document.getElementById('ping').innerText = response
    console.log(response)
}

func()
