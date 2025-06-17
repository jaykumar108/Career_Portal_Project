const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://chpqznnwxaewksfxfqmk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNocHF6bm53eGFld2tzZnhmcW1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxODk0NDcsImV4cCI6MjA1Nzc2NTQ0N30.7O6Q9F8wmLbFqxApDr3xvaD7R1ppmanSCZsJQqPTWvg'; // Service role key for backend
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase; 