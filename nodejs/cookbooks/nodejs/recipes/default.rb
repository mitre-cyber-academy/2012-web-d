#From https://github.com/xer0x/cookbook-nodejs/raw/master/recipes/default.rb
# A node.js recipe

# Install using Chris Lea's packages

# sudo add-apt-repository ppa:chris-lea/node.js
# sudo apt-get update
# sudo apt-get install nodejs

case node[:platform]
when "debian", "ubuntu"
  
  # Add the repo for node
  bash "Copy web application" do
    user "ubuntu"
    code <<-EOH
      sudo apt-add-repository ppa:chris-lea/node.js
      sudo apt-get update
    EOH
  end
  
  package "nodejs"
  package "nodejs-dev"
  package "npm"
  
else
  # compile node on another OS?
  # May work if needed: https://github.com/carbonfive/mdxp-cookbooks/tree/master/nodejs
end
