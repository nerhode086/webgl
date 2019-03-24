/**
 * 根据着色器代码生成着色器
 * @param {WebGLObject} gl 
 * @param {string} scriptId 
 * @param {string} type 
 * @returns {WebGLShader}
 */
function createShaderFromScript(gl, scriptId, type) {
    if(!type || !scriptId) {
        return
    }

    let shaderSource = document.querySelector(`#${scriptId}`).innerHTML // 获取着色器源码
    let shader = gl.createShader(type) // 创建着色器对象

    gl.shaderSource(shader, shaderSource) // 通过源码创建着色器对象
    gl.compileShader(shader)
    return shader
}

/**
 * 生成随机颜色
 * @returns {Object} 
 */
function randomColor() {
    const random = Math.random
    return {
        r: 255 * random(),
        g: 255 * random(),
        b: 255 * random(),
        a: 1 * random()
    }
}

let canvas = document.querySelector("#canvas")
let gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl") // 对于部分浏览器需要加上实验前缀

// 生成着色器
let vertexShader = createShaderFromScript(gl, 'vertexShader', gl.VERTEX_SHADER) // 创建顶点着色器
let fragmentShader = createShaderFromScript(gl, 'fragmentShader', gl.FRAGMENT_SHADER) // 创建片元着色器

// 绘制着色器程序
let program = gl.createProgram()

// 分别将顶点着色器与片元着色器分配至着色器程序上
gl.attachShader(program, vertexShader)
gl.attachShader(program, fragmentShader)

// 链接并使用着色器程序
gl.linkProgram(program) 
gl.useProgram(program)

let a_Position = gl.getAttribLocation(program, 'a_Position') // 找到顶点着色器的变量 a_Position
let a_Screen_Size = gl.getAttribLocation(program, 'a_Screen_Size') // 找到顶点着色器的变量 a_Screen_Size
let u_Color = gl.getUniformLocation(program, 'u_Color') // 找到片元着色器的变量 u_Color

gl.vertexAttrib2f(a_Screen_Size, canvas.width, canvas.height)

let pointsArr = [] // 存储点击坐标

canvas.addEventListener('click', e => {
    let point = {
        x: e.pageX,
        y: e.pageY,
        color: randomColor()
    }
    // pointsArr.push(point)

    // 每次点击都清空画布
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    let color = point.color
    gl.uniform4f(u_Color, color.r, color.g, color.b, color.a) // 为片元着色器传递随机颜色
    gl.vertexAttrib2f(a_Position, point.x, point.y) // 为顶点着色器传递顶点坐标
    gl.drawArrays(gl.POINTS, 0, 1)

    // pointsArr.forEach(point => {

    // })
})

gl.clearColor(0.0, 0.0, 0.0, 1.0) //设置清空画布颜色为黑色
gl.clear(gl.COLOR_BUFFER_BIT) // 清空画布




