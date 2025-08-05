import React from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import Chart from "react-apexcharts";

const DashboardStats = ({ contacts, deals, activities }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate key metrics
  const totalContacts = contacts.length;
  const totalDeals = deals.length;
  const activeDeals = deals.filter(deal => !["Won", "Lost"].includes(deal.stage)).length;
  const wonDeals = deals.filter(deal => deal.stage === "Won");
  const totalRevenue = wonDeals.reduce((sum, deal) => sum + deal.value, 0);
  const pipelineValue = deals
    .filter(deal => !["Won", "Lost"].includes(deal.stage))
    .reduce((sum, deal) => sum + deal.value, 0);
  
  const recentActivities = activities
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Deal stage distribution for chart
  const stageData = {
    Lead: deals.filter(d => d.stage === "Lead").length,
    Qualified: deals.filter(d => d.stage === "Qualified").length,
    Proposal: deals.filter(d => d.stage === "Proposal").length,
    Won: deals.filter(d => d.stage === "Won").length,
    Lost: deals.filter(d => d.stage === "Lost").length,
  };

  const chartOptions = {
    chart: {
      type: "donut",
      toolbar: { show: false }
    },
    labels: Object.keys(stageData),
    colors: ["#3B82F6", "#F59E0B", "#6B46C1", "#10B981", "#EF4444"],
    legend: {
      position: "bottom",
      fontSize: "12px"
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%"
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        }
      }
    }]
  };

  const StatCard = ({ title, value, icon, gradient, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
        <Card.Content className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className={`text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                {value}
              </p>
            </div>
            <div className={`p-3 rounded-full bg-gradient-to-br ${gradient.replace('text-', 'from-').replace(' to-', '-400 to-')} opacity-20`}>
              <ApperIcon name={icon} className="h-6 w-6 text-gray-700" />
            </div>
          </div>
        </Card.Content>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Contacts"
          value={totalContacts}
          icon="Users"
          gradient="from-blue-600 to-blue-800"
          delay={0}
        />
        <StatCard
          title="Active Deals"
          value={activeDeals}
          icon="Target"
          gradient="from-purple-600 to-purple-800"
          delay={0.1}
        />
        <StatCard
          title="Pipeline Value"
          value={formatCurrency(pipelineValue)}
          icon="TrendingUp"
          gradient="from-green-600 to-green-800"
          delay={0.2}
        />
        <StatCard
          title="Revenue Won"
          value={formatCurrency(totalRevenue)}
          icon="DollarSign"
          gradient="from-primary-600 to-secondary-500"
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card className="h-full">
            <Card.Header>
              <Card.Title className="flex items-center space-x-2">
                <ApperIcon name="PieChart" className="h-5 w-5 text-primary-600" />
                <span>Pipeline Distribution</span>
              </Card.Title>
            </Card.Header>
            <Card.Content>
              {totalDeals > 0 ? (
                <Chart
                  options={chartOptions}
                  series={Object.values(stageData)}
                  type="donut"
                  height={300}
                />
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <div className="text-center">
                    <ApperIcon name="PieChart" className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No deals to display</p>
                  </div>
                </div>
              )}
            </Card.Content>
          </Card>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Card className="h-full">
            <Card.Header>
              <Card.Title className="flex items-center space-x-2">
                <ApperIcon name="Activity" className="h-5 w-5 text-primary-600" />
                <span>Recent Activities</span>
              </Card.Title>
            </Card.Header>
            <Card.Content>
              {recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => {
                    const contact = contacts.find(c => c.Id === activity.contactId);
                    return (
                      <motion.div
                        key={activity.Id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: 0.6 + index * 0.05 }}
                        className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div className="p-2 bg-primary-100 rounded-full">
                          <ApperIcon 
                            name={activity.type === "call" ? "Phone" : activity.type === "email" ? "Mail" : "Calendar"} 
                            className="h-4 w-4 text-primary-600" 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 capitalize">
                            {activity.type} with {contact?.name || "Unknown Contact"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {activity.description}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <div className="text-center">
                    <ApperIcon name="Calendar" className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No recent activities</p>
                  </div>
                </div>
              )}
            </Card.Content>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardStats;