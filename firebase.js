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
    doc,
} from "firebase/firestore";
import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL
} from "firebase/storage";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "firebase/auth";

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
const storage = getStorage(app);
const auth = getAuth(app);

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

export async function addUserToDb(userInfo, id) {
    try {
        await setDoc(doc(db, "users", id), userInfo);
        console.log("user written with ID: ", id);
    } catch (e) {
        console.error("Error adding user: ", e);
    }
}

export async function editDocument(title, id) {
    await setDoc(doc(db, "Tasks", id), {
        title: title,
        completed: true,
    });
}

export async function createUser(userInfo) {
    try {
        //Sign up
        const userCredential = await createUserWithEmailAndPassword(auth, userInfo.email, userInfo.password)
        const user = userCredential.user
        console.log(user)

        //Subir Imagen
        const url = await uploadFile(user.id + userInfo.picture.name, userInfo.picture, 'profilePicture')

        //Crear usuario en DB
        const dbInfo = {
            url,
            email: userInfo.email,
            birthday: userInfo.birthday,
            username: userInfo.username
        }
        addUserToDb(dbInfo, user.id)
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(error.message)
        // ..
    }
}

export async function uploadFile(name, file, folder) {
    const taskImgRef = ref(storage, `${folder}/${name}`);

    try {
        await uploadBytes(taskImgRef, file);
        const url = await getDownloadURL(taskImgRef);
        return url;
    } catch (error) {
        console.log("error creando imagen ->", error);
    }
}

export async function logInUser(email, password) {

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const user = userCredential.user;
        return {status: true, info: user.id}

    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        return {status: false, info: errorMessage}
    };
}