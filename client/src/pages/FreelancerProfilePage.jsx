import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  MapPin,
  BadgeCheck,
  Briefcase,
  GraduationCap,
  MessageSquare,
  Camera,
  Plus,
  Trash2,
  Star,
} from "lucide-react";
import MainLayout from "../layout/MainLayout";
import Loader from "../components/Loader";
import Avatar from "../components/Avatar";
import StarRating from "../components/StarRating";
import { useAuth } from "../context/AuthContext";
import userService from "../services/userService";
import reviewService from "../services/reviewService";
import { formatCurrency, formatDate } from "../utils/helpers";

const tabs = ["Overview", "Portfolio", "Experience", "Education", "Reviews"];

const FreelancerProfilePage = () => {
  const { id } = useParams();
  const { user, updateUserInContext } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Overview");
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [portfolioForm, setPortfolioForm] = useState({ title: "", description: "", link: "" });
  const [expForm, setExpForm] = useState({ title: "", company: "", from: "", to: "", description: "" });
  const [eduForm, setEduForm] = useState({ school: "", degree: "", from: "", to: "" });

  const isOwnProfile = user?._id === id;

  const fetchProfile = async () => {
    try {
      const data = await userService.getUserProfile(id);
      setProfile(data.user);
      setEditForm({
        name: data.user.name,
        title: data.user.title || "",
        bio: data.user.bio || "",
        location: data.user.location || "",
        hourlyRate: data.user.hourlyRate || 0,
        skills: (data.user.skills || []).join(", "),
      });
    } catch (err) {
      toast.error("Profile not found");
      navigate("/freelancers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchProfile();
    reviewService
      .getReviewsForFreelancer(id)
      .then((data) => setReviews(data.reviews))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSaveProfile = async () => {
    try {
      const payload = {
        ...editForm,
        skills: editForm.skills.split(",").map((s) => s.trim()).filter(Boolean),
      };
      const data = await userService.updateProfile(payload);
      setProfile(data.user);
      if (isOwnProfile) updateUserInContext(data.user);
      setEditing(false);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("profileImage", file);
    try {
      const data = await userService.updateProfileImage(formData);
      setProfile((p) => ({ ...p, profileImage: data.profileImage }));
      if (isOwnProfile) updateUserInContext({ ...user, profileImage: data.profileImage });
      toast.success("Profile picture updated!");
    } catch (err) {
      toast.error("Failed to upload image");
    }
  };

  const handleAddPortfolio = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(portfolioForm).forEach(([k, v]) => formData.append(k, v));
      const data = await userService.addPortfolio(formData);
      setProfile((p) => ({ ...p, portfolio: data.portfolio }));
      setPortfolioForm({ title: "", description: "", link: "" });
      toast.success("Portfolio item added!");
    } catch (err) {
      toast.error("Failed to add portfolio item");
    }
  };

  const handleDeletePortfolio = async (itemId) => {
    const data = await userService.deletePortfolio(itemId);
    setProfile((p) => ({ ...p, portfolio: data.portfolio }));
    toast.success("Removed");
  };

  const handleAddExperience = async (e) => {
    e.preventDefault();
    const data = await userService.addExperience(expForm);
    setProfile((p) => ({ ...p, experience: data.experience }));
    setExpForm({ title: "", company: "", from: "", to: "", description: "" });
    toast.success("Experience added!");
  };

  const handleDeleteExperience = async (itemId) => {
    const data = await userService.deleteExperience(itemId);
    setProfile((p) => ({ ...p, experience: data.experience }));
  };

  const handleAddEducation = async (e) => {
    e.preventDefault();
    const data = await userService.addEducation(eduForm);
    setProfile((p) => ({ ...p, education: data.education }));
    setEduForm({ school: "", degree: "", from: "", to: "" });
    toast.success("Education added!");
  };

  const handleDeleteEducation = async (itemId) => {
    const data = await userService.deleteEducation(itemId);
    setProfile((p) => ({ ...p, education: data.education }));
  };

  if (loading) return <Loader fullScreen />;
  if (!profile) return null;

  return (
    <MainLayout>
      <section className="bg-hero-gradient py-16">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 flex flex-col md:flex-row items-start gap-6"
          >
            <div className="relative">
              <Avatar src={profile.profileImage} name={profile.name} size="xl" />
              {isOwnProfile && (
                <label className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-mocha flex items-center justify-center cursor-pointer">
                  <Camera size={15} className="text-cream" />
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display text-2xl font-bold text-ink">{profile.name}</h1>
                {profile.isVerified && <BadgeCheck size={20} className="text-mocha" />}
              </div>
              <p className="text-mocha-dark font-heading font-medium">
                {profile.title || (profile.role === "client" ? "Client" : "Freelancer")}
              </p>
              {profile.location && (
                <p className="text-sm text-ink/50 flex items-center gap-1 mt-1">
                  <MapPin size={13} /> {profile.location}
                </p>
              )}
              <div className="mt-2">
                <StarRating rating={profile.rating} numReviews={profile.numReviews} />
              </div>
              <p className="text-ink/70 mt-4 max-w-2xl">{profile.bio || "No bio added yet."}</p>

              <div className="flex flex-wrap gap-2 mt-4">
                {(profile.skills || []).map((skill) => (
                  <span key={skill} className="badge">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full md:w-auto">
              {profile.role === "freelancer" && (
                <div className="text-right">
                  <p className="font-display text-2xl font-bold text-mocha">
                    {formatCurrency(profile.hourlyRate)}
                    <span className="text-sm font-normal text-ink/50">/hr</span>
                  </p>
                </div>
              )}
              {isOwnProfile ? (
                <button onClick={() => setEditing(true)} className="btn-primary">
                  Edit Profile
                </button>
              ) : (
                user && (
                  <button
                    onClick={() => navigate("/messages", { state: { userId: profile._id } })}
                    className="btn-primary"
                  >
                    <MessageSquare size={16} /> Message
                  </button>
                )
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {editing && isOwnProfile && (
        <section className="py-8">
          <div className="section-container">
            <div className="glass-card p-8 max-w-2xl mx-auto space-y-4">
              <h2 className="font-heading font-semibold text-xl text-ink mb-2">Edit Profile</h2>
              <input
                className="input-field"
                placeholder="Full name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
              <input
                className="input-field"
                placeholder="Professional title"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              />
              <textarea
                className="input-field resize-none"
                rows={4}
                placeholder="Bio"
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              />
              <input
                className="input-field"
                placeholder="Location"
                value={editForm.location}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
              />
              {profile.role === "freelancer" && (
                <input
                  type="number"
                  className="input-field"
                  placeholder="Hourly rate"
                  value={editForm.hourlyRate}
                  onChange={(e) => setEditForm({ ...editForm, hourlyRate: e.target.value })}
                />
              )}
              <input
                className="input-field"
                placeholder="Skills (comma separated)"
                value={editForm.skills}
                onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
              />
              <div className="flex gap-3">
                <button onClick={handleSaveProfile} className="btn-primary flex-1">
                  Save Changes
                </button>
                <button onClick={() => setEditing(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-12">
        <div className="section-container">
          <div className="flex gap-2 mb-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-full font-heading text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? "bg-mocha-gradient text-cream"
                    : "bg-white/60 text-ink/70 hover:bg-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "Overview" && (
            <div className="glass-card p-8">
              <p className="text-ink/70 leading-relaxed">
                {profile.bio || "This user hasn't added a bio yet."}
              </p>
            </div>
          )}

          {activeTab === "Portfolio" && (
            <div className="space-y-6">
              {isOwnProfile && (
                <form onSubmit={handleAddPortfolio} className="glass-card p-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    className="input-field"
                    placeholder="Project title"
                    required
                    value={portfolioForm.title}
                    onChange={(e) => setPortfolioForm({ ...portfolioForm, title: e.target.value })}
                  />
                  <input
                    className="input-field"
                    placeholder="Project link (optional)"
                    value={portfolioForm.link}
                    onChange={(e) => setPortfolioForm({ ...portfolioForm, link: e.target.value })}
                  />
                  <textarea
                    className="input-field md:col-span-2 resize-none"
                    rows={2}
                    placeholder="Description"
                    value={portfolioForm.description}
                    onChange={(e) => setPortfolioForm({ ...portfolioForm, description: e.target.value })}
                  />
                  <button type="submit" className="btn-primary md:col-span-2">
                    <Plus size={16} /> Add Portfolio Item
                  </button>
                </form>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(profile.portfolio || []).map((item) => (
                  <div key={item._id} className="glass-card p-5 relative">
                    {isOwnProfile && (
                      <button
                        onClick={() => handleDeletePortfolio(item._id)}
                        className="absolute top-4 right-4 text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                    <h4 className="font-heading font-semibold text-ink mb-2">{item.title}</h4>
                    <p className="text-sm text-ink/60 mb-2">{item.description}</p>
                    {item.link && (
                      <a href={item.link} target="_blank" rel="noreferrer" className="text-sm text-mocha font-medium">
                        View Project →
                      </a>
                    )}
                  </div>
                ))}
                {(profile.portfolio || []).length === 0 && (
                  <p className="text-sm text-ink/50">No portfolio items added yet.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "Experience" && (
            <div className="space-y-6">
              {isOwnProfile && (
                <form onSubmit={handleAddExperience} className="glass-card p-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    className="input-field"
                    placeholder="Job title"
                    required
                    value={expForm.title}
                    onChange={(e) => setExpForm({ ...expForm, title: e.target.value })}
                  />
                  <input
                    className="input-field"
                    placeholder="Company"
                    required
                    value={expForm.company}
                    onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                  />
                  <input
                    className="input-field"
                    placeholder="From (e.g. 2021)"
                    value={expForm.from}
                    onChange={(e) => setExpForm({ ...expForm, from: e.target.value })}
                  />
                  <input
                    className="input-field"
                    placeholder="To (e.g. Present)"
                    value={expForm.to}
                    onChange={(e) => setExpForm({ ...expForm, to: e.target.value })}
                  />
                  <textarea
                    className="input-field md:col-span-2 resize-none"
                    rows={2}
                    placeholder="Description"
                    value={expForm.description}
                    onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                  />
                  <button type="submit" className="btn-primary md:col-span-2">
                    <Plus size={16} /> Add Experience
                  </button>
                </form>
              )}
              <div className="space-y-4">
                {(profile.experience || []).map((exp) => (
                  <div key={exp._id} className="glass-card p-6 flex gap-4 relative">
                    <div className="w-12 h-12 rounded-2xl bg-nude/40 flex items-center justify-center shrink-0">
                      <Briefcase size={20} className="text-mocha" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-heading font-semibold text-ink">{exp.title}</h4>
                      <p className="text-sm text-mocha-dark">{exp.company}</p>
                      <p className="text-xs text-ink/50">
                        {exp.from} - {exp.to || "Present"}
                      </p>
                      <p className="text-sm text-ink/60 mt-2">{exp.description}</p>
                    </div>
                    {isOwnProfile && (
                      <button
                        onClick={() => handleDeleteExperience(exp._id)}
                        className="text-red-500 h-fit"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
                {(profile.experience || []).length === 0 && (
                  <p className="text-sm text-ink/50">No experience added yet.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "Education" && (
            <div className="space-y-6">
              {isOwnProfile && (
                <form onSubmit={handleAddEducation} className="glass-card p-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    className="input-field"
                    placeholder="School / University"
                    required
                    value={eduForm.school}
                    onChange={(e) => setEduForm({ ...eduForm, school: e.target.value })}
                  />
                  <input
                    className="input-field"
                    placeholder="Degree"
                    required
                    value={eduForm.degree}
                    onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                  />
                  <input
                    className="input-field"
                    placeholder="From (e.g. 2016)"
                    value={eduForm.from}
                    onChange={(e) => setEduForm({ ...eduForm, from: e.target.value })}
                  />
                  <input
                    className="input-field"
                    placeholder="To (e.g. 2020)"
                    value={eduForm.to}
                    onChange={(e) => setEduForm({ ...eduForm, to: e.target.value })}
                  />
                  <button type="submit" className="btn-primary md:col-span-2">
                    <Plus size={16} /> Add Education
                  </button>
                </form>
              )}
              <div className="space-y-4">
                {(profile.education || []).map((edu) => (
                  <div key={edu._id} className="glass-card p-6 flex gap-4 relative">
                    <div className="w-12 h-12 rounded-2xl bg-nude/40 flex items-center justify-center shrink-0">
                      <GraduationCap size={20} className="text-mocha" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-heading font-semibold text-ink">{edu.school}</h4>
                      <p className="text-sm text-mocha-dark">{edu.degree}</p>
                      <p className="text-xs text-ink/50">
                        {edu.from} - {edu.to}
                      </p>
                    </div>
                    {isOwnProfile && (
                      <button onClick={() => handleDeleteEducation(edu._id)} className="text-red-500 h-fit">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
                {(profile.education || []).length === 0 && (
                  <p className="text-sm text-ink/50">No education added yet.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "Reviews" && (
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-sm text-ink/50">No reviews yet.</p>
              ) : (
                reviews.map((review) => (
                  <div key={review._id} className="glass-card p-6 flex gap-4">
                    <Avatar src={review.reviewer?.profileImage} name={review.reviewer?.name} size="md" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-heading font-semibold text-ink">{review.reviewer?.name}</p>
                        <span className="text-xs text-ink/50">{formatDate(review.createdAt)}</span>
                      </div>
                      <div className="flex gap-1 my-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < review.rating ? "fill-mocha text-mocha" : "text-nude/30"}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-ink/60">{review.comment}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default FreelancerProfilePage;
