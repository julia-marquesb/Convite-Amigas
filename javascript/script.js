  const FORMSPREE_ENDPOINT = "https://formspree.io/f/xgavnqyv";

  // ---- screen navigation ----
  const screens = {
    home: document.getElementById('screen-home'),
    sim: document.getElementById('screen-sim'),
    nao: document.getElementById('screen-nao'),
    success: document.getElementById('screen-success'),
  };

  function showScreen(name){
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
  }

  document.getElementById('btn-sim').addEventListener('click', () => showScreen('sim'));
  document.getElementById('btn-nao').addEventListener('click', () => showScreen('nao'));
  document.querySelectorAll('[data-back]').forEach(btn=>{
    btn.addEventListener('click', () => showScreen('home'));
  });


  // ---- hour chips (tela sim - single select) ----
  let selectedHour = null;
  const hourChips = document.querySelectorAll('#hour-chips .chip');
  const submitSim = document.getElementById('submit-sim');
  const dateSimInput = document.getElementById('date-sim');

  function checkSimReady(){
    submitSim.disabled = !(selectedHour && dateSimInput.value);
  }

  hourChips.forEach(chip => {
    chip.addEventListener('click', () => {
      hourChips.forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      selectedHour = chip.dataset.hour;
      checkSimReady();
      //submitSim.disabled = false;
    });
  });

  dateSimInput.addEventListener('change', checkSimReady);

    // ---- date input (não flow) ----
  const dateNaoInput = document.getElementById('date-nao');
  const submitNao = document.getElementById('submit-nao');
  dateNaoInput.addEventListener('change', () => {
    submitNao.disabled = !dateNaoInput.value;
  });


 // --- This will stop the form from being sumbited before "screen 4" pops up
 const form = document.querySelector('form');

 form.addEventListener('submit', async (e) =>{
    e.preventDefault();//cancels the default behavior of going to formspree screen at the end

    const submitter = e.submitter;//which "Enviar" btn was clicked
    let payload, statusEl, button;

    if (submitter.id === 'submit-sim'){
        button = submitSim;
        statusEl = document.getElementById('status-sim');
        payload = {
            resposta: "Sim",
            data_sugerida: dateSimInput.value,
            horario: selectedHour,
            lugar_sugerido: document.getElementById('place-sim').value.trim() || "(nenhum lugar sugerido)"
        };

    } else if (submitter.id === 'submit-nao') {
        button = submitNao;
        statusEl = document.getElementById('status-nao');
        payload = {
            resposta: "Nao",
            data_alternativa: dateNaoInput.value,
            lugar_alternativo: document.getElementById('place-nao').value.trim() || "(nenhum lugar sugerido)"
        };

        } else {
            return;
        }

        await sendToFormspree(payload, statusEl, button);
 });


 //function that will send the data to formspree
 async function sendToFormspree (payload, statusEl,button){
    button.disabled = true;
    statusEl.textContent = "enviando...";
    statusEl.style.color = "";

    try{
        const res = await fetch(FORMSPREE_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(payload)
        });
        if (res.ok){
            showScreen('success');
        } else {
            statusEl.textContent = "algo deu errado, tente novamente";
            statusEl.style.color = "#E14F7A";
            button.disabled = false;
        }
    } catch (err) {
        statusEl.textContent = "sem conexao, tente novamente";
        statusEl.style.color = "#E14F7A";
        button.disabled = false;
    }
 }



  