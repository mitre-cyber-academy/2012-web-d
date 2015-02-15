# These are written fairly naively and may need polishing

# Install node packages
bash "Install npm packages" do
  user "ubuntu"
  code <<-EOH
    cd /home/ubuntu
    sudo npm --ws:verbose -g install express
    sudo npm --ws:verbose -g install zombie
    sudo npm --ws:verbose -g install forever
    EOH
end

# Copy over webapp into a production directory
bash "Copy web application" do
  user "ubuntu"
  code <<-EOH
    mv $HOME/chef-solo/cookbooks/challenge/aux/webapp $HOME
    rm -f $HOME/webapp/*.coffee
    rm -f $HOME/webapp/routes/*.coffee
    rm -f $HOME/webapp/public/javascripts/*.coffee
  EOH
end

# Start the app as a daemon
bash "Start web application" do
  user "ubuntu"
  code <<-EOH
    cd $HOME/webapp/
    export PATH="/home/ubuntu/node_modules/forever/bin:$PATH"
    forever start app.js
  EOH
end
