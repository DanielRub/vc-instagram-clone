import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import ProfileInfos from '../components/ProfileInfos';
import ProfileStory from '../components/ProfileStory';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import { Colors, Endpoints, Images } from "../constants";
import { FlatList } from 'react-native-gesture-handler';
import ProfileTabsCustom from '../components/ProfileTabsCustom';

const data = [{ key: '1' }];

const ProfileView = () => {

    const [userData, setUserData] = useState({});
    const [token, setToken] = useState(null);

    const fetchData = async () => {
        await axios.get(Endpoints.GET_PROFILE, {
            headers: { 'Authorization': 'Bearer ' + token }
        })
            .then((result) => {
                if (result.data) {
                    setUserData(result.data);
                    storeData(result.data);
                }
            })
            .catch((e) => {
                getLocalData();
            });
    }

    const getToken = async () => {
        try {
            const token = await AsyncStorage.getItem('@token')
            if (token !== null) {
                setToken(token)
            }
        } catch (e) { }
    }

    const storeData = async (data) => {
        try {
            await AsyncStorage.setItem("@userData", JSON.stringify(data));
        } catch (e) { }
    }

    const getLocalData = async () => {
        try {
            const data = await AsyncStorage.getItem('@userData')
            const parsedData = JSON.parse(data);
            setUserData(parsedData);
        } catch (e) { }
    }

    useEffect(() => {
        getToken();
        fetchData();
    }, []);

    return (
        <FlatList
            showsVerticalScrollIndicator={false}
            style={styles.container}
            data={data}
            renderItem={() => (
                <>
                    <ProfileInfos
                        name={userData.fullName}
                        posts={userData.posts ? userData.posts : 0}
                        folowers={userData.followers ? userData.followers : 0}
                        folowings={userData.following ? userData.following : 0}
                        avatar={userData.avatar ? userData.avatar : Images.DEFAULT_AVATAR}
                        statut="Entrepreneur"
                        bio={userData.bio ? userData.bio : "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."}
                    />
                    <ProfileStory />
                    <ProfileTabsCustom />
                </>
            )}
        >
        </FlatList>
    )
}

export default ProfileView

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.WHITE,
    },
})
