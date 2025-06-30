import React from 'react'
import FormContainer from '@/components/form/FormContainer';
import FormInput from '@/components/form/FormInput';
import { SubmitButton } from '@/components/form/Buttons';
import ImageInputContainer from '@/components/form/ImageInputContainer';
import { fetchProfile, updateProfileAction, updateProfileImageAction } from '@/utils/actions';



interface Profile {
    profileImage: string;
    username: string;
    firstName: string;
    lastName: string;

}


async function ProfilePage() {

    const profile: Profile = await fetchProfile();
    return (
        <>
            <div className='flex flex-col md:justify-center min-h-fit gap-5'>
                <h1 className='font-bold'>User Profile</h1>
                <FormContainer action={updateProfileAction}>
                    <div className='grid gap-4 md:grid-cols-2 mt-4 '>
                        <FormInput
                            type='text'
                            name='firstName'
                            label='First Name'
                            defaultValue={profile.firstName}
                        />
                        <FormInput
                            type='text'
                            name='lastName'
                            label='Last Name'
                            defaultValue={profile.lastName}
                        />
                        <FormInput
                            type='text'
                            name='username'
                            label='Username'
                            defaultValue={profile.username}
                        />
                    </div>
                    <SubmitButton text='Update Profile' className='mt-8' />
                </FormContainer>
                <ImageInputContainer
                    image={profile.profileImage}
                    name={profile.username}
                    action={updateProfileImageAction}
                    text='Update Profile Image'
                />
            </div>
        </>
    )
}

export default ProfilePage