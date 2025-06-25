// src/pages/Profile.tsx

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { ChildProfileResponse } from "@/types"; // Create this type based on backend schema

  

export default Profile;