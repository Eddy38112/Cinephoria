 
import tkinter as tk
from tkinter import ttk, messagebox
import requests

API_URL = "http://localhost:3000"
TOKEN = ""  # 🔑 Met ton token Employé ici

# 🔑 Authentification Employé
def login():
    global TOKEN
    email = entry_email.get()
    password = entry_password.get()

    response = requests.post(f"{API_URL}/auth/login", json={"email": email, "mot_de_passe": password})
    if response.status_code == 200:
        TOKEN = response.json()["token"]
        messagebox.showinfo("Succès", "Connexion réussie ✅")
        frame_login.pack_forget()
        frame_main.pack(fill="both", expand=True)
        get_incidents()
    else:
        messagebox.showerror("Erreur", "Échec de la connexion ❌")

# 🔧 Ajouter un incident
def add_incident():
    description = entry_desc.get("1.0", tk.END).strip()
    salle_id = entry_salle.get()
    urgence = combo_urgence.get()

    headers = {"Authorization": f"Bearer {TOKEN}"}
    data = {"description": description, "salle_id": salle_id, "urgence": urgence}
    response = requests.post(f"{API_URL}/incidents", json=data, headers=headers)

    if response.status_code == 201:
        messagebox.showinfo("Succès", "Incident ajouté avec succès ✅")
        entry_desc.delete("1.0", tk.END)
        get_incidents()
    else:
        messagebox.showerror("Erreur", f"Erreur : {response.json()}")

# 👀 Voir tous les incidents
def get_incidents():
    headers = {"Authorization": f"Bearer {TOKEN}"}
    response = requests.get(f"{API_URL}/incidents", headers=headers)

    if response.status_code == 200:
        for i in tree_incidents.get_children():
            tree_incidents.delete(i)

        for incident in response.json():
            tree_incidents.insert(
                "", tk.END,
                values=(incident["id"], incident["description"], incident["salle"], incident["urgence"], incident["etat"])
            )
    else:
        messagebox.showerror("Erreur", f"Erreur : {response.json()}")

# ♻️ Mettre à jour l’état d’un incident
def update_incident_state():
    selected_item = tree_incidents.selection()
    if not selected_item:
        messagebox.showwarning("Alerte", "Veuillez sélectionner un incident.")
        return

    incident_id = tree_incidents.item(selected_item)["values"][0]
    new_state = combo_state.get()
    headers = {"Authorization": f"Bearer {TOKEN}"}
    response = requests.put(f"{API_URL}/incidents/{incident_id}", json={"etat": new_state}, headers=headers)

    if response.status_code == 200:
        messagebox.showinfo("Succès", "État mis à jour ✅")
        get_incidents()
    else:
        messagebox.showerror("Erreur", f"Erreur : {response.json()}")

# 🖼️ Interface principale Tkinter
root = tk.Tk()
root.title("Cinéphoria - Gestion des Incidents")
root.geometry("800x600")

# 🔐 Frame de connexion
frame_login = tk.Frame(root)
frame_login.pack(fill="both", expand=True)

tk.Label(frame_login, text="E-mail :").pack(pady=5)
entry_email = tk.Entry(frame_login, width=30)
entry_email.pack(pady=5)

tk.Label(frame_login, text="Mot de passe :").pack(pady=5)
entry_password = tk.Entry(frame_login, width=30, show="*")
entry_password.pack(pady=5)

tk.Button(frame_login, text="Se connecter", command=login, bg="green", fg="white").pack(pady=10)

# 🏗️ Frame principale
frame_main = tk.Frame(root)

# ➕ Ajouter un incident
tk.Label(frame_main, text="📋 Ajouter un incident", font=("Arial", 14, "bold")).pack(pady=10)
tk.Label(frame_main, text="Description :").pack(pady=5)
entry_desc = tk.Text(frame_main, width=60, height=4)
entry_desc.pack(pady=5)

tk.Label(frame_main, text="Salle ID :").pack(pady=5)
entry_salle = tk.Entry(frame_main, width=20)
entry_salle.pack(pady=5)

tk.Label(frame_main, text="Urgence :").pack(pady=5)
combo_urgence = ttk.Combobox(frame_main, values=["Faible", "Moyenne", "Haute"])
combo_urgence.pack(pady=5)
combo_urgence.set("Faible")

tk.Button(frame_main, text="Ajouter Incident", command=add_incident, bg="blue", fg="white").pack(pady=10)

# 🗂️ Liste des incidents
tk.Label(frame_main, text="📝 Liste des incidents", font=("Arial", 14, "bold")).pack(pady=10)
cols = ("ID", "Description", "Salle", "Urgence", "État")
tree_incidents = ttk.Treeview(frame_main, columns=cols, show="headings", height=10)

for col in cols:
    tree_incidents.heading(col, text=col)
    tree_incidents.column(col, width=120)

tree_incidents.pack(pady=5)

# ♻️ Mettre à jour l’état
tk.Label(frame_main, text="Modifier l’état de l’incident :").pack(pady=5)
combo_state = ttk.Combobox(frame_main, values=["Ouvert", "En cours", "Résolu"])
combo_state.set("Ouvert")
combo_state.pack(pady=5)

tk.Button(frame_main, text="Mettre à jour l’état", command=update_incident_state, bg="orange", fg="white").pack(pady=10)

root.mainloop()
