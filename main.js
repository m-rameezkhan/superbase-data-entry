import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

let searchFlag = false
let submitBtn = document.getElementById("submit")

const findUser = async (event) => {
    let findUser = document.getElementById("find-user-input")
    let findUserInput = findUser.value

    if (findUserInput == '') {
        findUser.style.border = '1px solid red'
        return
    }
    findUser.style.border = 'none'
    searchFlag = true
    let tableBody = document.getElementById('tableBody')
    if (tableBody) {
        tableBody.innerHTML = ''
        const { data, error } = await supabase
            .from('Users')
            .select('*')
            .eq('Name', findUserInput)

        if (data == '') {
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
                        <button type="button" class="btn btn-update" onclick="confrimUpdate('${user.id}')">Update</button>
                        <button type="button" class="btn btn-delete" onclick="confirmDelete('${user.id}')">Delete</button>
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

        if (getName == '' || getAge == '') {
            document.getElementById('error').style.display = 'block'
            return
        }
        else {
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
                        <button type="button" class="btn btn-update" onclick="confrimUpdate('${user.id}')">Update</button>
                        <button type="button" class="btn btn-delete" onclick="confirmDelete('${user.id}')">Delete</button>
                    </td>
                </tr>`
        })
    }
}
window.renderTable = renderTable
renderTable()

let clearBtn = document.getElementById('clear-user')
if (clearBtn) {
    clearBtn.addEventListener('click', async () => {
        if (searchFlag == true) {
            let getInput = document.getElementById("find-user-input")
            getInput.value = ''
            searchFlag = false
            renderTable()
        }
        else {
            let getInput = document.getElementById("find-user-input")
            getInput.value = ''
        }
    })
}
const confirmDelete = (id) => {
    document.getElementById("modal-container").style.display = 'flex';

    const confirmBtn = document.getElementById('confrim-delete');

    const newConfirmBtn = confirmBtn.cloneNode(true); // remove previous listeners
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

    newConfirmBtn.addEventListener('click', async () => {
        await deleteUser(id);
        document.getElementById("modal-container").style.display = 'none';
    });
};
window.confirmDelete = confirmDelete

const deleteUser = async (id) => {
    const { error } = await supabase
        .from('Users')
        .delete()
        .eq('id', id)
    document.getElementById("modal-container").style.display = 'none';
    renderTable()
}
window.deleteUser = deleteUser

const confrimUpdate = async(id) => {
    document.getElementById('update-modal').style.display = 'flex';

    const updateBtn = document.getElementById('btn-update-user');

    // Get clean copy of the button to remove any previous event listeners
    const newUpdateBtn = updateBtn.cloneNode(true);
    updateBtn.parentNode.replaceChild(newUpdateBtn, updateBtn);

    const { data, error } = await supabase
            .from('Users')
            .select('*')
            .eq('id', id)
            .single();
            document.getElementById('updated-name').value = data.Name
            document.getElementById('updated-age').value = data.Age

    newUpdateBtn.addEventListener('click', async () => {

        const N = document.getElementById('updated-name').value.trim();
        const A = document.getElementById('updated-age').value.trim();

        if (N === '' || A === '') {
            alert("Please enter both name and age.");
            return;
        }

        await updateUser(id, N, A);
        document.getElementById('update-modal').style.display = 'none';
    });
}
window.confrimUpdate = confrimUpdate;


const updateUser = async (id, N, A) => {
    const { error } = await supabase
        .from('Users')
        .update({ Name: N, Age: A })
        .eq('id', id)
    renderTable()
}
window.updateUser = updateUser

const closeUpdateModal = () => {
    document.getElementById('update-modal').style.display = 'none'
}
window.closeUpdateModal = closeUpdateModal