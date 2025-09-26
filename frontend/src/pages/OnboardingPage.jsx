import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import toast, { LoaderIcon } from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import { CameraIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon } from "lucide-react";
import useAuthUser from "../hooks/useAuthUser";
import { LANGUAGES } from "../constants/index.js";
import avatarGenrator from "../../../backend/src/lib/avatarGenerator.js";
const OnboardingPage = () => {
  const queryClient = useQueryClient();
  const { authUser } = useAuthUser();

  const [formState, setformState] = useState({
    fullName: authUser?.fullName || "",
    profilePic: authUser?.profilePic || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    location: authUser?.location || "",
    learningLanguage: authUser?.learningLanguage || "",
    bio: authUser?.bio || "",
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("profile onboarded successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError:(error)=>{
      // console.log(error)
      toast.error(error.response.data.message)
       
    }
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  };
  const handleRandomAvatar = ()=>{
   const newProfilePic = avatarGenrator();
   setformState({...formState,profilePic:newProfilePic})
   toast.success("random avatar generated")

  }
  return (
    <div className="min-h-screen flex justify-center p-4 items-center bg-base-100 ">
      <div className="card bg-base-200 w-full  max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            Complete Your Profile
          </h1>
          <form action="" onSubmit={ handleSubmit} className="space-y-6">
            {/* PROFILE PIC CONTAINER */}
            <div className="flex flex-col items-center justify-center space-y-4">
              {/* IMAGE PREVIEW */}
              <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                {formState.profilePic ? (
                  <>
                    {/* TODO :: change the profile pic */}
                    <img
                      src={formState.profilePic}
                      alt="profile photo preview"
                      className="w-full h-full "
                    />
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-center h-full">
                      <CameraIcon className="size-12 opacity-40" />
                    </div>
                  </>
                )}
              </div>
              {/* generate random avatar btn */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleRandomAvatar()} 
                  className="btn bg-accent"
                >
                  <ShuffleIcon className="size-4 mr-2" />
                  Generate Random Avatar
                </button>
              </div>
            </div>
            {/* FULL NAME */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name </span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formState.fullName}
                onChange={(e) =>
                  setformState({ ...formState, fullName: e.target.value })
                }
                className="input input-bordered w-full "
                placeholder="Your Full name"
              />
            </div>
            {/* BIO */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                name="bio"
                id=""
                value={formState.bio}
                onChange={(e) => {
                  setformState({ ...formState, bio: e.target.value });
                }}
                className="textarea textarea-bordered h-24"
                placeholder="Tell About yourself and Your Language Learning Goals"
              ></textarea>
            </div>
            {/* LANGUAGES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* NATIVE LANGUAGE */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Native Language</span>
                </label>
                <select
                  name="nativeLanguage"
                  id=""
                  value={formState.nativeLanguage}
                  onChange={(e) =>
                    setformState({
                      ...formState,
                      nativeLanguage: e.target.value,
                    })
                  }
                  className="select select-bordered w-full"
                >
                  <option value="">Select your native language</option>
                  {LANGUAGES.map((lang) => (
                    <option value={lang.toLowerCase()} key={`native-${lang}`}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
              {/* LEARNING LANGUAGE  */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Learning Language</span>
                </label>
                <select
                  name="learningLanguage"
                  id=""
                  value={formState.learningLanguage}
                  onChange={(e) =>
                    setformState({
                      ...formState,
                      learningLanguage: e.target.value,
                    })
                  }
                  className="select select-bordered w-full"
                >
                  <option value="">Select your learning language</option>
                  {LANGUAGES.map((lang) => (
                    <option value={lang.toLowerCase()} key={`native-${lang}`}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* LOCATION */}
            <div className="form-control">
              <label className="label">
                <span className="label-text"> Location</span>
              </label>
              <div className="relative">
                <MapPinIcon
                  className="absolute size-5 top-1/2 transform -translate-y-1/2
                text-base-content opacity-70 left-3"
                />
                <input
                  type="text"
                  name="location"
                  value={formState.location}
                  onChange={(e) =>
                    setformState({ ...formState, location: e.target.value })
                  }
                  className="input input-bordered w-full pl-16"
                  placeholder="City,Country"
                />
              </div>
            </div>
            <button className="btn btn-primary w-full "
            disabled={isPending}
            >
              {!isPending ? <>
              <ShipWheelIcon className="size-5 mr-2"/>
              Complete Onboarding
              </>:<>
              <LoaderIcon className="animate-spin size-5 mr-2"/>
               Onboarding...
              </>}

            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
