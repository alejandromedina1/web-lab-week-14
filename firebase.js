// Import the functions you need from the SDKs you need
import {
    initializeApp
} from "firebase/app";
import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    setDoc,
    doc
} from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAISTz-_uf6eqrZxWKfKPZN3_ZfnE9IkO8",
    authDomain: "todo-list-alejandro.firebaseapp.com",
    projectId: "todo-list-alejandro",
    storageBucket: "todo-list-alejandro.appspot.com",
    messagingSenderId: "497042324910",
    appId: "1:497042324910:web:33f5d568bf0e2f6d7f9c3f",
    measurementId: "G-YR7RJX2996"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function getTasks() {

    const allTasks = []
    const querySnapshot = await getDocs(collection(db, "Tasks"));
    querySnapshot.forEach((doc) => {
        //console.log(`${doc.id} => ${doc.data()}`);
        allTasks.push({
            ...doc.data(),
            id: doc.id
        })
    });

    return allTasks
}

export async function addTask(taskTitle) {
    try {
        const docRef = await addDoc(collection(db, "Tasks"), {
            title: taskTitle,
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export async function editDocument(title, id) {
    await setDoc(doc(db, "Tasks", id), {
        title: title,
        completed: true,
    });
}