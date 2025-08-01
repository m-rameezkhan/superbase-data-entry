import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const supabaseUrl = 'https://nawcxbkiotamvvnlcobh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hd2N4Ymtpb3RhbXZ2bmxjb2JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3ODA3NjEsImV4cCI6MjA2OTM1Njc2MX0.n_yOwkh6wgV3cEqqy9OlJ3D48zrJTQUGuVY_Ntz34UE'
const supabase = createClient(supabaseUrl, supabaseKey)


let submitBtn = document.getElementById("submit")

const findUser = async (event) => {
    // event.preventDefault()
    let findUserInput = document.getElementById("find-user-input").value
    if (findUserInput == ''){
        renderTable()
        return
    }
    let tableBody = document.getElementById('tableBody')
    if (tableBody) {
        tableBody.innerHTML = ''
        const { data, error } = await supabase
            .from('Users')
            .select('*')
            .eq('Name', findUserInput)
        
        if(data == ''){
            tableBody.innerHTML += `<h2>No User Found</h2>`
        }

        data.map(user => {
            console.log('User id:', user.id)

            tableBody.innerHTML += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.Name}</td>
                    <td>${user.Age}</td>
                    <td>
                        <button type="button" class="btn btn-update" onclick="updateUser('${user.id}')">Update</button>
                        <button type="button" class="btn btn-delete" onclick="deleteUser('${user.id}')">Delete</button>
                    </td>
                </tr>`
        })
    }
}
window.findUser = findUser

if (submitBtn) {
    submitBtn.addEventListener('click', async (event) => {
        event.preventDefault()
        let getName = document.getElementById("name").value
        let getAge = document.getElementById("age").value

        if(getName == '' || getAge == ''){
            document.getElementById('error').style.display = 'block'
            return
        }
        else{
            document.getElementById('error').style.display = 'none'
        }

        const { error } = await supabase
            .from('Users')
            .insert({ Name: getName, Age: getAge })
        if (error) {
            console.error('Error inserting data:', error)
        } else {
            console.log('Data inserted successfully:', { Name: getName, Age: getAge })

            document.getElementById("modal-container").style.display = 'flex'

            document.getElementById("name").value = ''
            document.getElementById("age").value = ''
        }
    })
}

function closeModal() {
    document.getElementById("modal-container").style.display = 'none';
}
window.closeModal = closeModal

const renderTable = async () => {
    let tableBody = document.getElementById("tableBody")
    if (tableBody) {
        tableBody.innerHTML = ''
        const { data, error } = await supabase
            .from('Users')
            .select('*')
        console.log('Data fetched:', data)
        data.map(user => {
            tableBody.innerHTML += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.Name}</td>
                    <td>${user.Age}</td>
                    <td>
                        <button type="button" class="btn btn-update" onclick="updateUser('${user.id}')">Update</button>
                        <button type="button" class="btn btn-delete" onclick="deleteUser('${user.id}')">Delete</button>
                    </td>
                </tr>`
        })
    }
}
renderTable()

const deleteUser = async (id) => {
    const { error } = await supabase
        .from('Users')
        .delete()
        .eq('id', id)
    renderTable()
}
window.deleteUser = deleteUser

const updateUser = async (id) => {
    let N = prompt("Enter Your Updated Name")
    let A = prompt("Enter Your Updated Age")
    const { error } = await supabase
        .from('Users')
        .update({ Name: N, Age: A })
        .eq('id', id)
    renderTable()
}
window.updateUser = updateUser
