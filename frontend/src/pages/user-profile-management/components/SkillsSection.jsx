import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SkillsSection = ({ skillsOffered, skillsWanted, onSkillsUpdate }) => {
  const [activeTab, setActiveTab] = useState('offered');
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: '',
    proficiency: 'Beginner'
  });
  const [searchTerm, setSearchTerm] = useState('');

  const skillCategories = [
    "Programming", "Design", "Marketing", "Business", "Language", 
    "Music", "Art", "Cooking", "Sports", "Photography", "Writing", "Other"
  ];

  const proficiencyLevels = [
    { value: 'Beginner', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { value: 'Intermediate', color: 'bg-amber-100 text-amber-800 border-amber-200' },
    { value: 'Advanced', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' }
  ];

  const skillSuggestions = [
    "JavaScript", "React", "Python", "Graphic Design", "Photography", "Spanish", 
    "Guitar", "Cooking", "Marketing", "Writing", "Data Analysis", "UI/UX Design",
    "French", "Piano", "Yoga", "Public Speaking", "Excel", "Photoshop"
  ];

  // Convert string skills to object format for display
  const convertSkillsToObjects = (skills) => {
    return skills.map((skill, index) => ({
      id: index,
      name: skill,
      category: 'Other', // Default category since backend doesn't store this
      proficiency: 'Intermediate' // Default proficiency since backend doesn't store this
    }));
  };

  // Convert object skills back to strings for backend
  const convertSkillsToStrings = (skills) => {
    return skills.map(skill => skill.name);
  };

  const getCurrentSkills = () => {
    const skills = activeTab === 'offered' ? skillsOffered : skillsWanted;
    return convertSkillsToObjects(skills);
  };

  const getProficiencyColor = (proficiency) => {
    const level = proficiencyLevels.find(p => p.value === proficiency);
    return level ? level.color : 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const handleAddSkill = () => {
    if (newSkill.name.trim()) {
      const skillToAdd = {
        id: Date.now(),
        name: newSkill.name.trim(),
        category: newSkill.category || 'Other',
        proficiency: newSkill.proficiency
      };

      if (activeTab === 'offered') {
        const updatedSkillsOffered = [...skillsOffered, skillToAdd.name];
        const updatedSkillsWanted = skillsWanted;
        onSkillsUpdate(updatedSkillsOffered, updatedSkillsWanted);
      } else {
        const updatedSkillsOffered = skillsOffered;
        const updatedSkillsWanted = [...skillsWanted, skillToAdd.name];
        onSkillsUpdate(updatedSkillsOffered, updatedSkillsWanted);
      }

      setNewSkill({ name: '', category: '', proficiency: 'Beginner' });
      setIsAddingSkill(false);
      setSearchTerm('');
    }
  };

  const handleRemoveSkill = (skillId) => {
    const currentSkills = getCurrentSkills();
    const skillToRemove = currentSkills.find(skill => skill.id === skillId);
    
    if (skillToRemove) {
      if (activeTab === 'offered') {
        const updatedSkills = skillsOffered.filter(skill => skill !== skillToRemove.name);
        onSkillsUpdate(updatedSkills, skillsWanted);
      } else {
        const updatedSkills = skillsWanted.filter(skill => skill !== skillToRemove.name);
        onSkillsUpdate(skillsOffered, updatedSkills);
      }
    }
  };

  const handleSkillSuggestionClick = (suggestion) => {
    setNewSkill(prev => ({ ...prev, name: suggestion }));
    setSearchTerm(suggestion);
  };

  const filteredSuggestions = skillSuggestions.filter(skill =>
    skill.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !getCurrentSkills().some(existingSkill => 
      existingSkill.name.toLowerCase() === skill.toLowerCase()
    )
  );

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      {/* Tab Navigation */}
      <div className="flex border-b border-border mb-6">
        <button
          onClick={() => setActiveTab('offered')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors duration-200 ${
            activeTab === 'offered' ?'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Skills Offered ({skillsOffered.length})
        </button>
        <button
          onClick={() => setActiveTab('wanted')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors duration-200 ${
            activeTab === 'wanted' ?'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Skills Wanted ({skillsWanted.length})
        </button>
      </div>

      {/* Add Skill Section */}
      <div className="mb-6">
        {!isAddingSkill ? (
          <Button
            variant="outline"
            onClick={() => setIsAddingSkill(true)}
            iconName="Plus"
            iconPosition="left"
            className="w-full sm:w-auto"
          >
            Add {activeTab === 'offered' ? 'Skill I Offer' : 'Skill I Want'}
          </Button>
        ) : (
          <div className="space-y-4 p-4 bg-muted rounded-lg">
            <div className="space-y-3">
              {/* Skill Name Input with Autocomplete */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter skill name..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setNewSkill(prev => ({ ...prev, name: e.target.value }));
                  }}
                  className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
                
                {/* Autocomplete Suggestions */}
                {searchTerm && filteredSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
                    {filteredSuggestions.slice(0, 5).map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSkillSuggestionClick(suggestion)}
                        className="w-full px-3 py-2 text-left hover:bg-muted transition-colors duration-150"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Category and Proficiency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  value={newSkill.category}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, category: e.target.value }))}
                  className="px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                >
                  <option value="">Select category</option>
                  {skillCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>

                {activeTab === 'offered' && (
                  <select
                    value={newSkill.proficiency}
                    onChange={(e) => setNewSkill(prev => ({ ...prev, proficiency: e.target.value }))}
                    className="px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  >
                    {proficiencyLevels.map(level => (
                      <option key={level.value} value={level.value}>{level.value}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={handleAddSkill}
                disabled={!newSkill.name.trim()}
              >
                Add Skill
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsAddingSkill(false);
                  setNewSkill({ name: '', category: '', proficiency: 'Beginner' });
                  setSearchTerm('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {getCurrentSkills().map((skill) => (
          <div
            key={skill.id}
            className="group relative bg-muted rounded-lg p-3 hover:bg-muted/80 transition-colors duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground truncate">{skill.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">{skill.category}</p>
                {activeTab === 'offered' && (
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full border mt-2 ${getProficiencyColor(skill.proficiency)}`}>
                    {skill.proficiency}
                  </span>
                )}
              </div>
              
              <button
                onClick={() => handleRemoveSkill(skill.id)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded transition-all duration-200"
              >
                <Icon name="X" size={14} className="text-destructive" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {getCurrentSkills().length === 0 && (
        <div className="text-center py-8">
          <Icon name="BookOpen" size={48} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            No {activeTab === 'offered' ? 'skills offered' : 'skills wanted'} yet.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Add your first skill to get started!
          </p>
        </div>
      )}
    </div>
  );
};

export default SkillsSection;